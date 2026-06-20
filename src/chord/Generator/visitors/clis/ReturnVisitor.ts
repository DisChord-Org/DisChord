import { BaseNode, TokenType, TokenTypeUnion, ReturnNode } from "../../../types";
import { SubGenerator } from "../../SubGenerator";

/**
 * Atomic SubGenerator compiling subroutine exit statements and evaluation returns ('Devolver').
 * Supports both explicit expression returns and empty/void control breaking paths.
 * @class ReturnVisitor
 * @extends {SubGenerator<T, N>}
 * @template {string} T - Extensible token type string vector.
 * @template {BaseNode<T>} N - Extensible abstract syntax tree node layout.
 */
export class ReturnVisitor<T extends string, N extends BaseNode<T>> extends SubGenerator<T, N> {
    /**
     * The node type string that triggers the activation of this specific sub-generator.
     * @type {TokenTypeUnion<TokenType> | undefined}
     * @public
     * @static
     */
    public static triggerToken: TokenTypeUnion<TokenType> | undefined = TokenType.Devolver;

    /**
     * Transpiles a return directive checking if an evaluation sub-expression object is present.
     * @param {N} node - The generic operational syntax tree node instance.
     * @returns {string} The compiled native JavaScript return statement instruction.
     * @public
     */
    public visit(node: ReturnNode<T, N>): string {
        return node.object 
            ? `return ${this.parent.visit(node.object)}` 
            : 'return';
    }
}