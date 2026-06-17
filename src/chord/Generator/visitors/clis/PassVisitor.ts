import { BaseNode, PassLoopNode, TokenType, TokenTypeUnion } from "../../types";
import { SubGenerator } from "../SubGenerator";

/**
 * Atomic SubGenerator compiling structured loop bypass operations ('Pasar').
 * @class ContinueVisitor
 * @extends {SubGenerator<T, N>}
 * @template {string} T - Extensible token type string vector.
 * @template {BaseNode<T>} N - Extensible abstract syntax tree node layout structure.
 */
export class PassVisitor<T extends string, N extends BaseNode<T>> extends SubGenerator<T, N> {
    /**
     * The node type string that triggers the activation of this specific sub-generator.
     * @type {TokenTypeUnion<TokenType> | undefined}
     * @public
     * @static
     */
    public static triggerToken: TokenTypeUnion<TokenType> | undefined = TokenType.Pasar;

    /**
     * Bypasses the current loop iteration block yielding native JavaScript continuation instructions.
     * @param {PassLoopNode<T>} node - The specialized syntax tree node instance representing the continue directive.
     * @returns {string} The native JavaScript 'continue' literal execution string.
     * @public
     */
    public visit(node: PassLoopNode<T>): string {
        return 'continue';
    }
}