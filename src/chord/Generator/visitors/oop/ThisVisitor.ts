import { BaseNode, ThisNode, TokenType, TokenTypeUnion } from "../../../types";
import { SubGenerator } from "../../SubGenerator";

/**
 * Atomic SubGenerator compiling context self-references ('Esta').
 * Maps the native localized keyword down to standard JavaScript 'this' instance references.
 * @class ThisVisitor
 * @extends {SubGenerator<T, N>}
 * @template {string} T - Extensible token type string vector.
 * @template {BaseNode<T>} N - Extensible abstract syntax tree node layout.
 */
export class ThisVisitor<T extends string, N extends BaseNode<T>> extends SubGenerator<T, N> {
    /**
     * The node type string that triggers the activation of this specific sub-generator.
     * @type {TokenTypeUnion<TokenType> | undefined}
     * @public
     * @static
     */
    public static triggerToken: TokenTypeUnion<TokenType> | undefined = TokenType.Esta;

    /**
     * Transpiles context keywords yielding standard execution scope tokens.
     * @param {N} node - The generic operational syntax tree node instance.
     * @returns {string} The native JavaScript structural 'this' literal keyword string.
     * @public
     */
    public visit(node: ThisNode<T>): string {
        return 'this';
    }
}