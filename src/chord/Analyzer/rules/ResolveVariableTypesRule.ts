import { AnalysisRule } from "../AnalysisRule";
import { walkAST } from "../walkAST";
import { ASTNode, BaseNode, BinaryExpressionNode, IdentificatorNode, ListNode, LiteralNode, PrimitiveType, PrimitiveTypeName, TokenType, VariableNode } from "../../types";
import { buildDataTypeName, parseDataTypeName, VariableDataType } from "../../DataType";
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
 *    must be a *subset* of the declared one (`tipo (texto|numero)` accepts a `numero`-only value
 *    fine — the annotation only needs to cover what's actually possible), and array-ness must
 *    match exactly (`tipo texto` rejects `[1, 2]` regardless of element types), or
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
     * Resolves a variable's `dataType` by inferring it from the initializer (see
     * {@link inferDataType}) and, if an explicit `tipo` annotation is also present, checking the
     * inferred type is compatible with it: array-ness must match exactly, and every inferred
     * primitive kind must be a member of the declared union (the declared union may name more
     * kinds than the initializer actually produces — `tipo (texto|numero)` happily accepts a
     * `numero`-only value).
     * @param {VariableNode<T, N>} variableNode - The variable declaration to resolve.
     * @returns {VariableDataType | undefined} The resolved type, or `undefined` if neither an
     * annotation nor an inferrable initializer is present.
     * @throws {ChordError} If the explicit `tipo` annotation isn't compatible with the inferred
     * type.
     * @private
     */
    private resolveDataType (variableNode: VariableNode<T, N>): VariableDataType | undefined {
        const inferredType = this.inferDataType(variableNode.value);

        if (variableNode.dataType && inferredType && !this.isCompatible(variableNode.dataType, inferredType)) throw new ChordError({
            phase: ErrorLevel.Analysis,
            message: `La variable '${variableNode.id}' se declaró con tipo '${variableNode.dataType}' pero se le asignó un valor de tipo '${inferredType}'`,
            location: variableNode.location
        }).format();

        return variableNode.dataType ?? inferredType;
    }

    /**
     * Whether every primitive kind `inferred` names is also named by `declared`, and both agree on
     * array-ness — i.e. `inferred` describes a value `declared` is broad enough to accept.
     * @private
     */
    private isCompatible (declared: VariableDataType, inferred: VariableDataType): boolean {
        const declaredType = parseDataTypeName(declared);
        const inferredType = parseDataTypeName(inferred);

        return declaredType.isArray === inferredType.isArray
            && inferredType.kinds.every(kind => declaredType.kinds.includes(kind));
    }

    /**
     * Infers a `VariableDataType` from an expression, recursively:
     *  - a literal infers its scalar primitive directly;
     *  - an identifier infers whatever `dataType` the `SymbolTable` already resolved for it (only
     *    meaningful for a variable declared earlier in the same pass, or in an enclosing scope);
     *  - a binary expression infers via {@link inferBinaryType};
     *  - a list literal infers a homogeneous-or-union array type via {@link inferArrayType}.
     * Any other expression shape (a call, a property/index access, a component declaration, ...)
     * can't be inferred yet.
     * @param {ASTNode<T, N>} value - The expression to inspect.
     * @returns {VariableDataType | undefined} The inferred type, or `undefined` if this expression
     * shape isn't inferrable.
     * @private
     */
    private inferDataType (value: ASTNode<T, N>): VariableDataType | undefined {
        if (value.type === TokenType.LITERAL) {
            return this.primitiveTypeNames[typeof (value as LiteralNode<T>).value];
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
    private inferBinaryType (node: BinaryExpressionNode<T, N>): VariableDataType | undefined {
        if (this.numericOperators.includes(node.operator)) return PrimitiveType.Numero;
        if (this.comparisonOperators.includes(node.operator)) return PrimitiveType.Booleano;

        if (node.operator === TokenType.Mas) {
            const left = this.inferDataType(node.left);
            const right = this.inferDataType(node.right);
            if (left === undefined || right === undefined) return undefined;

            const leftKinds = parseDataTypeName(left).kinds;
            const rightKinds = parseDataTypeName(right).kinds;

            if (leftKinds.includes(PrimitiveType.Texto) || rightKinds.includes(PrimitiveType.Texto)) return PrimitiveType.Texto;
            if ([ ...leftKinds, ...rightKinds ].every(kind => kind === PrimitiveType.Numero)) return PrimitiveType.Numero;

            return undefined;
        }

        if (node.operator === TokenType.Y || node.operator === TokenType.O) {
            const left = this.inferDataType(node.left);
            const right = this.inferDataType(node.right);

            return left === PrimitiveType.Booleano && right === PrimitiveType.Booleano ? PrimitiveType.Booleano : undefined;
        }

        return undefined;
    }

    /**
     * Infers a list literal's array type: every element is inferred via {@link inferDataType}
     * (recursively — an element can itself be an identifier, a binary expression, ...), and their
     * primitive kinds are unioned together (`[1, "dos"]` -> `numero|texto[]`, not just `numero[]`
     * or a refusal to infer at all). Returns `undefined` for an empty list, one with any
     * non-inferrable element, or one with a nested list (arrays of arrays aren't supported).
     * @param {ListNode<T, N>} listNode - The list literal to inspect.
     * @returns {VariableDataType | undefined} The inferred array type, or `undefined` if the list
     * isn't inferrable.
     * @private
     */
    private inferArrayType (listNode: ListNode<T, N>): VariableDataType | undefined {
        if (listNode.body.length === 0) return undefined;

        const elementTypes = listNode.body.map(element => this.inferDataType(element));
        if (elementTypes.some(elementType => elementType === undefined)) return undefined;

        const kinds = new Set<PrimitiveTypeName>();

        for (const elementType of elementTypes as VariableDataType[]) {
            const { kinds: elementKinds, isArray } = parseDataTypeName(elementType);
            if (isArray) return undefined;

            elementKinds.forEach(kind => kinds.add(kind));
        }

        return buildDataTypeName([ ...kinds ], true);
    }
}
