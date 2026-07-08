import { BaseNode, LiteralNode, TokenType, TokenTypeUnion } from "../../../types";
import { SubGenerator } from "../../SubGenerator";

/**
 * Atomic SubGenerator to translate literal nodes into primitive JavaScript expressions.
 * @class LiteralVisitor
 * @extends {SubGenerator<T, N>}
 * @template {string} T - Extensible token type string vector.
 * @template {BaseNode<T>} N - Extensible abstract syntax tree node layout.
 */
export class LiteralVisitor<T extends string, N extends BaseNode<T>> extends SubGenerator<T, N> {
    /**
     * The node type string that triggers the activation of this specific sub-generator.
     * @public
     * @static
     */
    public static triggerToken: TokenTypeUnion<TokenType> | undefined = TokenType.LITERAL;

    /**
     * Translates a LiteralNode into its clean JavaScript string representation.
     * @param {LiteralNode<T>} node - The specific literal abstract syntax tree node.
     * @returns {string} The primitive value formatted as runnable JavaScript code.
     * @public
     */
    public visit(node: LiteralNode<T>): string {
        if (typeof node.value === "boolean") {
            return node.value ? "true" : "false";
        }

        if (typeof node.value === "string") {
            return JSON.stringify(node.value);
        }

        return String(node.value);
    }
}