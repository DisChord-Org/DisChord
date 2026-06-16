import { BaseNode, TokenType, TokenTypeUnion, VariableNode } from "../../types";
import { SubGenerator } from "../SubGenerator";

/**
 * Atomic SubGenerator that handles variable initialization structures.
 * @class VariableVisitor
 * @extends {SubGenerator<T, N>}
 * @template {string} T - Extensible token type string vector.
 * @template {BaseNode<T>} N - Extensible abstract syntax tree node layout.
 */
export class VariableVisitor<T extends string, N extends BaseNode<T>> extends SubGenerator<T, N> {
    /**
     * The node type string that triggers the activation of this specific sub-generator.
     * @public
     * @static
     */
    public static triggerToken: TokenTypeUnion<TokenType> | undefined = TokenType.VARIABLE;

    /**
     * Translates a VariableNode into a JavaScript assignment token expression.
     * @param {VariableNode<T, N>} node - The specific variable definition abstract syntax tree node.
     * @returns {string} The transpiled variable instantiation statement string.
     * @public
     */
    public visit(node: VariableNode<T, N>): string {
        return `let ${node.id} = ${this.parent.visit(node.value)}`;
    }
}