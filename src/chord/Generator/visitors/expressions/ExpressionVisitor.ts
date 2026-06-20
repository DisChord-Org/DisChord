import { TokenType, TokenTypeUnion, ExpressionNode, BaseNode } from "../../../types";
import { SubGenerator } from "../../SubGenerator";

/**
 * Atomic SubGenerator handling explicit grouping operations wrappers ('Expresion').
 * Ensures mathematical and logical hierarchy isolation by wrapping the compiled output in native JavaScript brackets.
 * @class ExpressionVisitor
 * @extends {SubGenerator<T, N>}
 * @template {string} T - Extensible token type string vector.
 * @template {BaseNode<T>} N - Extensible abstract syntax tree node layout structure.
 */
export class ExpressionVisitor<T extends string, N extends BaseNode<T>> extends SubGenerator<T, N> {
    /**
     * The node type string that triggers the activation of this specific sub-generator.
     * @type {TokenTypeUnion<TokenType> | undefined}
     * @public
     * @static
     */
    public static triggerToken: TokenTypeUnion<TokenType> | undefined = TokenType.EXPRESION;

    /**
     * Encloses nested expressions layouts into standard evaluation grouping scopes.
     * @param {ExpressionNode<T, N>} node - The specialized syntax tree node instance representing the expression group.
     * @returns {string} The enclosed JavaScript runnable logic string wrapped in parenthesis.
     * @public
     */
    public visit(node: ExpressionNode<T, N>): string {
        return `(${this.parent.visit(node.object)})`;
    }
}