import { UnaryNode, BaseNode, PrimitiveType, PrimitiveTypeName, TokenType, TokenTypeUnion } from "../../../types";
import { SubGenerator } from "../../SubGenerator";

/**
 * Atomic SubGenerator compiling standard prefix unary expressions ('Unario').
 * Handles native language type checking and localization mappings.
 * @class UnaryVisitor
 * @extends {SubGenerator<T, N>}
 * @template {string} T - Extensible token type string vector.
 * @template {BaseNode<T>} N - Extensible abstract syntax tree node layout.
 */
export class UnaryVisitor<T extends string, N extends BaseNode<T>> extends SubGenerator<T, N> {
    /**
     * The node type string that triggers the activation of this specific sub-generator.
     * @public
     * @static
     */
    public static triggerToken: TokenTypeUnion<TokenType> | undefined = TokenType.UNARIO;

    /**
     * Translation table backing the `tipo x` operator: maps a native JS `typeof` result to the
     * {@link PrimitiveTypeName} DisChord surfaces for it at runtime. Mirrors
     * `BinaryExpressionVisitor.operatorsMap`'s pattern of an inline, visitor-local translation
     * table rather than a shared external one; `ResolveVariableTypesRule` needs this exact same
     * correspondence at compile time (to infer a `var`'s `dataType` from a literal initializer) and
     * keeps its own copy for the same reason `operatorsMap` isn't shared either — each compiler
     * stage's SubGenerator/AnalysisRule is self-contained, with `PrimitiveTypeName` as the single
     * typed contract keeping every copy honest.
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
     * Transpiles a prefix unary operational node into JavaScript syntax.
     * @param {UnaryNode<T, N>} node - The target analytical unary operation tree node.
     * @returns {string} The formatted runnable native JavaScript unary expression string.
     * @public
     */
    public visit(node: UnaryNode<T, N>): string {
        if (node.operator === TokenType.TIPO) {
            const mapping = JSON.stringify(this.primitiveTypeNames);
            return `${mapping}[typeof (${this.parent.visit(node.object)})]`;
        }

        return '';
    }
}