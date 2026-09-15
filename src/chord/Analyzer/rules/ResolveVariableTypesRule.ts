import { AnalysisRule } from "../AnalysisRule";
import { walkAST } from "../walkAST";
import { ASTNode, BaseNode, BinaryExpressionNode, IdentificatorNode, ListNode, LiteralNode, PrimitiveType, PrimitiveTypeName, TokenType, VariableNode } from "../../types";
import { arrayOf, DataType, DataTypeKind, formatDataType, isAssignable, primitive, TupleDataType, unionOf } from "../../DataType";
import { ChordError, ErrorLevel } from "../../../errors/ChordError";

/**
 * Pass 3 of the Analyzer's binding model ("Tipos"): resolves and validates each variable's
 * `dataType` now that every declaration from Pass 2 ({@link BindDeclarationsRule}) is already
 * registered in the `SymbolTable`. Runs as its own pass, after binding, rather than being folded
 * into Pass 2 itself, so that a future type check needing to see *other* variables' types (not
 * just the one currently being declared) always finds a fully populated table — the same reason
 * `BindDeclarationsRule` itself is a separate pass from reference validation.
 *
 * A variable's `dataType` is either
 *  - inferred from its initializer ({@link inferDataType} — literals, identifiers referencing an
 *    already-resolved variable, arithmetic/comparison/logical binary expressions, and list
 *    literals, recursively combining element types into a union when they differ),
 *  - validated against an explicit `tipo` annotation, when both are present: the inferred type
 *    must be `isAssignable` to the declared one (`tipo (texto|numero)` accepts a `numero`-only
 *    value fine — the annotation only needs to cover what's actually possible), or
 *  - left as-is (the explicit annotation, or `undefined`) when the initializer isn't inferrable at
 *    all — a function call, a property/index access, a component declaration (embed, comando,
 *    ...), or a function's return value (functions have no declared return type yet).
 *
 * Mirrors `BindDeclarationsRule`'s own traversal: classes and functions get their own lexical
 * scope for their body, entered/exited via `walkAST`'s `exit` hook, so a variable's resolved type
 * lands on the same `SymbolTable` scope entry `BindDeclarationsRule` created for it.
 */
export class ResolveVariableTypesRule<T extends string, N extends BaseNode<T>> extends AnalysisRule<T, N> {
    /**
     * Translation table used to infer a variable's {@link PrimitiveTypeName} from a literal
     * initializer's native JS value (`typeof (variableNode.value as LiteralNode<T>).value`). Kept
     * as its own inline, rule-local table — the same self-contained-visitor/rule pattern
     * `BinaryExpressionVisitor.operatorsMap` and `UnaryVisitor.primitiveTypeNames` follow — rather
     * than importing the one `UnaryVisitor` keeps for the runtime `tipo x` operator, since this
     * Analyzer rule has no business depending on a Generator-layer class. `PrimitiveTypeName` is
     * what keeps both copies honest.
     * @private
     * @readonly
     */
    private readonly primitiveTypeNames: Record<string, PrimitiveTypeName> = {
        number: PrimitiveType.Numero,
        string: PrimitiveType.Texto,
        boolean: PrimitiveType.Booleano,
        undefined: PrimitiveType.Indefinido,
        object: PrimitiveType.Objeto
    };

    /**
     * Every binary operator that always produces a JS `number` result regardless of its operands'
     * types — even `"a" - 1` is `NaN`, and `typeof NaN === 'number'` — so these can be inferred as
     * `numero` unconditionally, without needing to know the operand types at all. `mas` (`+`) is
     * deliberately excluded: unlike the others, it concatenates into a string when either operand
     * is one, so it needs its own operand-aware handling (see {@link inferBinaryType}).
     * @private
     * @readonly
     */
    private readonly numericOperators: readonly string[] = [
        TokenType.Menos, TokenType.Por, TokenType.Entre, TokenType.Exponente, TokenType.Resto
    ];

    /**
     * Every binary operator that always produces a JS `boolean` result regardless of its
     * operands' types — comparison always coerces to `true`/`false`. `y`/`o` (`&&`/`||`)
     * deliberately aren't here: JS's short-circuit evaluation returns whichever operand decided
     * the result, not necessarily a boolean, so those need their own operand-aware handling.
     * @private
     * @readonly
     */
    private readonly comparisonOperators: readonly string[] = [
        TokenType.Igual, TokenType.IgualTipado, TokenType.Mayor, TokenType.Menor,
        TokenType.MayorIgual, TokenType.MenorIgual, TokenType.NoIgual, TokenType.NoIgualTipado
    ];

    /**
     * @override
     */
    check (nodes: ASTNode<T, N>[]): void {
        nodes.forEach(node => walkAST<T, N>(node, current => this.enter(current), current => this.exit(current)));
    }

    /**
     * Mirrors {@link BindDeclarationsRule}'s scope tracking (push on class/function entry) and, for
     * a `VariableNode`, resolves and stores its `dataType` via {@link resolveDataType}.
     * @private
     */
    private enter (node: ASTNode<T, N>): void {
        switch (node.type) {
            case TokenType.Clase:
            case TokenType.Funcion:
                this.context.symbolTable.pushScope();
                break;

            case TokenType.VARIABLE:
                const variableNode = node as VariableNode<T, N>;
                const dataType = this.resolveDataType(variableNode);
                this.context.symbolTable.setDataType(variableNode.id, dataType);
                break;
        }
    }

    /**
     * Mirrors {@link BindDeclarationsRule}'s scope tracking (pop on class/function exit).
     * @private
     */
    private exit (node: ASTNode<T, N>): void {
        if (node.type === TokenType.Clase || node.type === TokenType.Funcion) {
            this.context.symbolTable.popScope();
        }
    }

    /**
     * Resolves a variable's `dataType`. When the annotation is a tuple and the initializer is a
     * list literal, validates it contextually, position by position (see
     * {@link validateTupleLiteral}) — a tuple can never be reached through {@link inferDataType}
     * (only an explicit `tipo [...]` produces one), so the general "infer, then check
     * `isAssignable`" path below could never validate one correctly: inferring `[1, "a"]` on its
     * own always yields a flat union array (`numero|texto[]`), not a tuple, and a tuple is never
     * `isAssignable` from an array regardless of elements. Otherwise, infers the type from the
     * initializer (see {@link inferDataType}) and, if an explicit `tipo` annotation is also
     * present, checks the inferred type is {@link isAssignable} to it.
     * @param {VariableNode<T, N>} variableNode - The variable declaration to resolve.
     * @returns {DataType | undefined} The resolved type, or `undefined` if neither an annotation
     * nor an inferrable initializer is present.
     * @throws {ChordError} If the explicit `tipo` annotation isn't assignable from the inferred
     * type (or, for a tuple, if the list literal's shape doesn't match it).
     * @private
     */
    private resolveDataType (variableNode: VariableNode<T, N>): DataType | undefined {
        if (variableNode.dataType?.kind === DataTypeKind.Tuple && variableNode.value.type === TokenType.LISTA) {
            this.validateTupleLiteral(variableNode.id, variableNode.dataType, variableNode.value as ListNode<T, N>);
            return variableNode.dataType;
        }

        const inferredType = this.inferDataType(variableNode.value);

        if (variableNode.dataType && inferredType && !isAssignable(variableNode.dataType, inferredType)) throw new ChordError({
            phase: ErrorLevel.Analysis,
            message: `La variable '${variableNode.id}' se declaró con tipo '${formatDataType(variableNode.dataType)}' pero se le asignó un valor de tipo '${formatDataType(inferredType)}'`,
            location: variableNode.location
        }).format();

        return variableNode.dataType ?? inferredType;
    }

    /**
     * Infers a `DataType` from an expression, recursively:
     *  - a literal infers its scalar primitive directly;
     *  - an identifier infers whatever `dataType` the `SymbolTable` already resolved for it (only
     *    meaningful for a variable declared earlier in the same pass, or in an enclosing scope);
     *  - a binary expression infers via {@link inferBinaryType};
     *  - a list literal infers a homogeneous-or-union array type via {@link inferArrayType}.
     * Any other expression shape (a call, a property/index access, a component declaration, ...)
     * can't be inferred yet.
     * @param {ASTNode<T, N>} value - The expression to inspect.
     * @returns {DataType | undefined} The inferred type, or `undefined` if this expression shape
     * isn't inferrable.
     * @private
     */
    private inferDataType (value: ASTNode<T, N>): DataType | undefined {
        if (value.type === TokenType.LITERAL) {
            const kind = this.primitiveTypeNames[typeof (value as LiteralNode<T>).value];
            return kind && primitive(kind);
        }

        if (value.type === TokenType.IDENTIFICADOR) {
            return this.context.symbolTable.lookup((value as IdentificatorNode<T>).value)?.dataType;
        }

        if (value.type === TokenType.EXPRESION_BINARIA) {
            return this.inferBinaryType(value as BinaryExpressionNode<T, N>);
        }

        if (value.type === TokenType.LISTA) {
            return this.inferArrayType(value as ListNode<T, N>);
        }

        return undefined;
    }

    /**
     * Infers a binary expression's result type from its operator, and — only for `mas`/`y`/`o`,
     * whose result depends on their operands' own types — by recursively inferring `node.left`/
     * `node.right` via {@link inferDataType}. See {@link numericOperators}/{@link
     * comparisonOperators}'s own doc comments for why the rest don't need that.
     * @private
     */
    private inferBinaryType (node: BinaryExpressionNode<T, N>): DataType | undefined {
        if (this.numericOperators.includes(node.operator)) return primitive(PrimitiveType.Numero);
        if (this.comparisonOperators.includes(node.operator)) return primitive(PrimitiveType.Booleano);

        if (node.operator === TokenType.Mas) {
            const left = this.inferDataType(node.left);
            const right = this.inferDataType(node.right);
            if (left === undefined || right === undefined) return undefined;

            const textLike = primitive(PrimitiveType.Texto);
            if (isAssignable(textLike, left) || isAssignable(textLike, right)) return textLike;

            const numberLike = primitive(PrimitiveType.Numero);
            if (isAssignable(numberLike, left) && isAssignable(numberLike, right)) return numberLike;

            return undefined;
        }

        if (node.operator === TokenType.Y || node.operator === TokenType.O) {
            const boolLike = primitive(PrimitiveType.Booleano);
            const left = this.inferDataType(node.left);
            const right = this.inferDataType(node.right);

            return left && right && isAssignable(boolLike, left) && isAssignable(boolLike, right) ? boolLike : undefined;
        }

        return undefined;
    }

    /**
     * Infers a list literal's array type: every element is inferred via {@link inferDataType}
     * (recursively — an element can itself be an identifier, a binary expression, ...), and their
     * primitive kinds are unioned together (`[1, "dos"]` -> `numero|texto[]`, not just `numero[]`
     * or a refusal to infer at all). Returns `undefined` for an empty list, one with any
     * non-inferrable element, or one with a nested list/tuple element (an array's inferred type is
     * always a flat union of primitives — a tuple type is only ever produced by an explicit `tipo
     * [...]` annotation, never inferred, matching how TypeScript itself never infers a tuple type
     * from a plain array literal either).
     * @param {ListNode<T, N>} listNode - The list literal to inspect.
     * @returns {DataType | undefined} The inferred array type, or `undefined` if the list isn't
     * inferrable.
     * @private
     */
    private inferArrayType (listNode: ListNode<T, N>): DataType | undefined {
        if (listNode.body.length === 0) return undefined;

        const elementTypes = listNode.body.map(element => this.inferDataType(element));
        if (elementTypes.some(elementType => elementType === undefined)) return undefined;

        const kinds = new Set<PrimitiveTypeName>();

        for (const elementType of elementTypes as DataType[]) {
            if (elementType.kind === DataTypeKind.Array || elementType.kind === DataTypeKind.Tuple) return undefined;

            if (elementType.kind === DataTypeKind.Primitive) kinds.add(elementType.name);
            else elementType.members.forEach(member => kinds.add(member.name));
        }

        return arrayOf(unionOf([ ...kinds ]));
    }

    /**
     * Validates a list literal against a declared tuple type, position by position: the list must
     * have exactly as many elements as the tuple, and each element's inferred type must be
     * {@link isAssignable} to that position's declared type. Unlike {@link inferArrayType} (which
     * infers a single flat union for the whole list), this is *contextual*: it only runs when a
     * `tipo [...]` annotation is already known, the same way TypeScript's checker only checks an
     * array literal against a tuple shape when one is already expected from context, rather than
     * ever inferring a tuple type from the literal on its own.
     * @param {string} id - The variable's name, for the error message.
     * @param {TupleDataType} tupleType - The declared tuple type.
     * @param {ListNode<T, N>} listNode - The list literal assigned to the variable.
     * @throws {ChordError} If the list's length doesn't match the tuple's, or an element's
     * inferred type isn't assignable to its declared position.
     * @private
     */
    private validateTupleLiteral (id: string, tupleType: TupleDataType, listNode: ListNode<T, N>): void {
        if (listNode.body.length !== tupleType.elements.length) throw new ChordError({
            phase: ErrorLevel.Analysis,
            message: `La variable '${id}' se declaró como tupla de ${tupleType.elements.length} elemento(s) pero se le asignó una lista de ${listNode.body.length}`,
            location: listNode.location
        }).format();

        listNode.body.forEach((element, index) => {
            const elementType = this.inferDataType(element);
            const expectedType = tupleType.elements[index];

            if (elementType && !isAssignable(expectedType, elementType)) throw new ChordError({
                phase: ErrorLevel.Analysis,
                message: `La variable '${id}' se declaró con tipo '${formatDataType(tupleType)}', pero el elemento ${index} es de tipo '${formatDataType(elementType)}', se esperaba '${formatDataType(expectedType)}'`,
                location: element.location
            }).format();
        });
    }
}
