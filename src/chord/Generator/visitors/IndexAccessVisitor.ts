import { AccessNodeByIndex, BaseNode, TokenType, TokenTypeUnion } from "../../types";
import { SubGenerator } from "../SubGenerator";

/**
 * Atomic SubGenerator managing bracket notation dynamic indexing data accesses.
 * @class IndexAccessVisitor
 * @extends {SubGenerator<T, N>}
 * @template {string} T - Extensible token type string vector.
 * @template {BaseNode<T>} N - Extensible abstract syntax tree node layout.
 */
export class IndexAccessVisitor<T extends string, N extends BaseNode<T>> extends SubGenerator<T, N> {
    /**
     * The node type string that triggers the activation of this specific sub-generator.
     * @public
     * @static
     */
    public static triggerToken: TokenTypeUnion<TokenType> | undefined = TokenType.ACCESO_POR_INDICE;

    /**
     * Transpiles bracket access patterns recursively routing inner objects and index expressions.
     * @param {AccessNodeByIndex<T, N>} node - The target index access syntax tree node.
     * @returns {string} The generated JavaScript bracket-notation property lookup string.
     * @public
     */
    public visit(node: AccessNodeByIndex<T, N>): string {
        return `${this.parent.visit(node.object)}[${this.parent.visit(node.index)}]`;
    }
}