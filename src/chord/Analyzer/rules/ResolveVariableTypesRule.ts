import { AnalysisRule } from "../AnalysisRule";
import { walkAST } from "../walkAST";
import { ASTNode, BaseNode, ListNode, LiteralNode, PrimitiveType, PrimitiveTypeName, TokenType, VariableDataType, VariableNode } from "../../types";
import { ChordError, ErrorLevel } from "../../../errors/ChordError";

/**
 * Pass 3 of the Analyzer's binding model ("Tipos"): resolves and validates each variable's
 * `dataType` now that every declaration from Pass 2 ({@link BindDeclarationsRule}) is already
 * registered in the `SymbolTable`. Runs as its own pass, after binding, rather than being folded
 * into Pass 2 itself, so that a future type check needing to see *other* variables' types (not
 * just the one currently being declared) always finds a fully populated table — the same reason
 * `BindDeclarationsRule` itself is a separate pass from reference validation.
 *
 * For now this only handles the primitive (scalar and homogeneous-array) case: a variable's
 * `dataType` is either
 *  - inferred from its initializer, when that initializer is a literal (`var x es 5` -> `numero`)
 *    or a list literal whose elements are all literals of the same type
 *    (`var x es [1, 2]` -> `numero[]`),
 *  - validated against an explicit `tipo` annotation, when both are present and disagree
 *    (`var x tipo texto es 5` and `var x tipo texto[] es [1, 2]` are both rejected), or
 *  - left as-is (the explicit annotation, or `undefined`) when the initializer isn't a literal or
 *    a homogeneous list literal — inferring the type of an arbitrary expression, function return,
 *    a mixed-type list, or a component declaration (embed, comando, ...) is future work, not
 *    implemented by this rule.
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
     * Resolves a variable's `dataType`: if its initializer is a literal, the type is inferred from
     * the literal's native JS value (via {@link primitiveTypeNames}); if it's a list literal whose
     * elements are all literals of the same type, the array type is inferred via
     * {@link inferArrayElementType}. If an explicit `tipo` annotation is also present, it must
     * match the inferred type. Any other initializer shape (expressions, calls, component
     * declarations, a mixed-type or non-literal list, ...) can't be inferred yet, so only the
     * explicit annotation (if any) is kept.
     * @param {VariableNode<T, N>} variableNode - The variable declaration to resolve.
     * @returns {VariableDataType | undefined} The resolved type, or `undefined` if neither an
     * annotation nor an inferrable initializer is present.
     * @throws {ChordError} If the explicit `tipo` annotation contradicts the inferred type.
     * @private
     */
    private resolveDataType (variableNode: VariableNode<T, N>): VariableDataType | undefined {
        const inferredType = this.inferDataType(variableNode.value);

        if (variableNode.dataType && inferredType && variableNode.dataType !== inferredType) throw new ChordError({
            phase: ErrorLevel.Analysis,
            message: `La variable '${variableNode.id}' se declaró con tipo '${variableNode.dataType}' pero se le asignó un valor de tipo '${inferredType}'`,
            location: variableNode.location
        }).format();

        return variableNode.dataType ?? inferredType;
    }

    /**
     * Infers a `VariableDataType` from an initializer expression, when its shape allows it: a
     * literal infers its scalar primitive directly; a list literal infers a homogeneous array type
     * via {@link inferArrayElementType}. Any other expression shape can't be inferred yet.
     * @param {ASTNode<T, N>} value - The initializer expression to inspect.
     * @returns {VariableDataType | undefined} The inferred type, or `undefined` if this
     * initializer shape isn't inferrable.
     * @private
     */
    private inferDataType (value: ASTNode<T, N>): VariableDataType | undefined {
        if (value.type === TokenType.LITERAL) {
            return this.primitiveTypeNames[typeof (value as LiteralNode<T>).value];
        }

        if (value.type === TokenType.LISTA) {
            const elementType = this.inferArrayElementType(value as ListNode<T, N>);
            return elementType && `${elementType}[]`;
        }

        return undefined;
    }

    /**
     * Infers the common element type of a list literal, when every element is itself a literal of
     * the exact same primitive type (e.g. `[1, 2, 3]` -> `numero`). An empty list, a list with a
     * non-literal element (a nested list, an expression, ...), or a list mixing element types
     * (`[1, "dos"]`) all return `undefined` — there is no single element type to report.
     * @param {ListNode<T, N>} listNode - The list literal to inspect.
     * @returns {PrimitiveTypeName | undefined} The shared element type, or `undefined` if the list
     * isn't homogeneous (or is empty, or holds non-literal elements).
     * @private
     */
    private inferArrayElementType (listNode: ListNode<T, N>): PrimitiveTypeName | undefined {
        if (listNode.body.length === 0) return undefined;

        const elementTypes = listNode.body.map(element => element.type === TokenType.LITERAL
            ? this.primitiveTypeNames[typeof (element as LiteralNode<T>).value]
            : undefined
        );

        const [ firstType, ...restTypes ] = elementTypes;
        const isHomogeneous = firstType !== undefined && restTypes.every(elementType => elementType === firstType);

        return isHomogeneous ? firstType : undefined;
    }
}
