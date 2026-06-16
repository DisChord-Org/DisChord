import { BaseNode, SuperNode, TokenType, TokenTypeUnion } from "../../types";
import { SubGenerator } from "../SubGenerator";

/**
 * Atomic SubGenerator compiling parent class constructor and method reference proxies ('Super').
 * @class SuperVisitor
 * @extends {SubGenerator<T, N>}
 * @template {string} T - Extensible token type string vector.
 * @template {BaseNode<T>} N - Extensible abstract syntax tree node layout.
 */
export class SuperVisitor<T extends string, N extends BaseNode<T>> extends SubGenerator<T, N> {
    /**
     * The node type string that triggers the activation of this specific sub-generator.
     * @type {TokenTypeUnion<TokenType> | undefined}
     * @public
     * @static
     */
    public static triggerToken: TokenTypeUnion<TokenType> | undefined = TokenType.Super;

    /**
     * Transpiles parent reference operators down to standard ECMAScript 'super' invocations.
     * @param {N} node - The generic operational syntax tree node instance.
     * @returns {string} The native JavaScript structural 'super' literal keyword string.
     * @public
     */
    public visit(node: SuperNode<T>): string {
        return 'super';
    }
}