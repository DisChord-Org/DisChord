import { BaseNode, IdentificatorNode, TokenType, TokenTypeUnion } from "../../../types";
import { SubGenerator } from "../../SubGenerator";

/**
 * Atomic SubGenerator to process syntactic Identifier source references.
 * @class IdentificatorVisitor
 * @extends {SubGenerator<T, N>}
 * @template {string} T - Extensible token type string vector.
 * @template {BaseNode<T>} N - Extensible abstract syntax tree node layout.
 */
export class IdentificatorVisitor<T extends string, N extends BaseNode<T>> extends SubGenerator<T, N> {
    /**
     * The node type string that triggers the activation of this specific sub-generator.
     * @public
     * @static
     */
    public static triggerToken: TokenTypeUnion<TokenType> | undefined = TokenType.IDENTIFICADOR;

    /**
     * Translates an Identifier node directly into its raw string literal value representation.
     * @param {IdentificatorNode<T>} node - The concrete identifier syntax tree node.
     * @returns {string} The raw string naming the resolved identifier block.
     * @public
     */
    public visit(node: IdentificatorNode<T>): string {
        return node.value;
    }
}