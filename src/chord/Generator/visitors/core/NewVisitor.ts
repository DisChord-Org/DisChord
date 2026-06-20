import { BaseNode, TokenType, TokenTypeUnion, NewNode } from "../../../types";
import { SubGenerator } from "../../SubGenerator";

/**
 * Sub-generator responsible for compiling instantiation nodes ('Nuevo') into native JavaScript.
 * Handles the transpilation of class/object creation syntax.
 * * @class NewVisitor
 * @extends {SubGenerator<T, N>}
 * @template {string} T - Extensible token type registry.
 * @template {BaseNode<T>} N - Extensible Abstract Syntax Tree (AST) node structure.
 */
export class NewVisitor<T extends string, N extends BaseNode<T>> extends SubGenerator<T, N> {
    /**
     * The node type string that triggers the activation of this specific sub-generator.
     * @public
     * @static
     */
    public static triggerToken: TokenTypeUnion<TokenType> | undefined = TokenType.Nuevo;

    /**
     * Compiles a 'Nuevo' AST node into its JavaScript equivalent execution statement.
     * * @param {NewNode<T, N>} node - The specific instantiation AST node to transpile.
     * @returns {string} The transpiled JavaScript 'new ClassName(...)' expression string.
     * @throws {Error} If the inner object node compilation fails or produces an invalid state.
     * @public
     */
    public visit(node: NewNode<T, N>): string {
        return `new ${this.parent.visit(node.object)}`;
    }
}