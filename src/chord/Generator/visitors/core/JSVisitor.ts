import { BaseNode, TokenType, TokenTypeUnion, JSNode } from "../../../types";
import { SubGenerator } from "../../SubGenerator";

/**
 * Atomic SubGenerator compiling direct raw JavaScript injection fragments ('JS').
 * Acts as an escape hatch bypass directly writing the string token value into the output.
 * @class JSVisitor
 * @extends {SubGenerator<T, N>}
 * @template {string} T - Extensible token type string vector.
 * @template {BaseNode<T>} N - Extensible abstract syntax tree node layout.
 */
export class JSVisitor<T extends string, N extends BaseNode<T>> extends SubGenerator<T, N> {
    /**
     * The node type string that triggers the activation of this specific sub-generator.
     * @type {TokenTypeUnion<TokenType> | undefined}
     * @public
     * @static
     */
    public static triggerToken: TokenTypeUnion<TokenType> | undefined = TokenType.JS;

    /**
     * Transpiles raw JS syntactic nodes by directly extracting and yielding their underlying string value.
     * @param {JSNode<T>} node - The generic operational syntax tree node instance.
     * @returns {string} The raw unmanipulated native JavaScript code snippet.
     * @public
     */
    public visit(node: JSNode<T>): string {
        return `${node.value}`;
    }
}