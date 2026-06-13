import { BaseNode, ExitLoopNode, TokenType, TokenTypeUnion } from "../../types";
import { SubGenerator } from "../SubGenerator";

/**
 * Atomic SubGenerator compiling structured loop breaking operations ('Salir').
 * @class BreakVisitor
 * @extends {SubGenerator<T, N>}
 * @template {string} T - Extensible token type string vector.
 * @template {BaseNode<T>} N - Extensible abstract syntax tree node layout structure.
 */
export class BreakVisitor<T extends string, N extends BaseNode<T>> extends SubGenerator<T, N> {
    /**
     * The node type string that triggers the activation of this specific sub-generator.
     * @type {TokenTypeUnion<TokenType> | undefined}
     * @public
     * @static
     */
    public static triggerToken: TokenTypeUnion<TokenType> | undefined = TokenType.Salir;

    /**
     * Interrupts current loop executions yielding native JavaScript breaking instructions.
     * @param {ExitLoopNode<T>} node - The specialized syntax tree node instance representing the break directive.
     * @returns {string} The native JavaScript 'break' literal execution string.
     * @public
     */
    public visit(node: ExitLoopNode<T>): string {
        return 'break';
    }
}