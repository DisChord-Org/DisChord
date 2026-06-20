import { ListNode, BaseNode, TokenType, TokenTypeUnion, ASTNode } from "../../../types";
import { SubGenerator } from "../../SubGenerator";

/**
 * Atomic SubGenerator compiling Chord sequential array collection structures ('Lista').
 * @class ListVisitor
 * @extends {SubGenerator<T, N>}
 * @template {string} T - Extensible token type string vector.
 * @template {BaseNode<T>} N - Extensible abstract syntax tree node layout.
 */
export class ListVisitor<T extends string, N extends BaseNode<T>> extends SubGenerator<T, N> {
    /**
     * The node type string that triggers the activation of this specific sub-generator.
     * @public
     * @static
     */
    public static triggerToken: TokenTypeUnion<TokenType> | undefined = TokenType.LISTA;

    /**
     * Transpiles array instances flattening operational child sub-nodes.
     * @param {ListNode<T, N>} node - The target list syntax tree node layout.
     * @returns {string} The fully compiled native JavaScript array expression literal string.
     * @public
     */
    public visit(node: ListNode<T, N>): string {
        const elements = node.body
            .map((element: ASTNode<T, N>) => this.parent.visit(element))
            .join(', ');
        return `[${elements}]`;
    }
}