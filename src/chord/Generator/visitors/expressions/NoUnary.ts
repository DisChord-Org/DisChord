import { NoUnaryNode, BaseNode, TokenType, TokenTypeUnion } from "../../types";
import { SubGenerator } from "../SubGenerator";

/**
 * Atomic SubGenerator compiling logical inversion prefix operations ('NoUnario').
 * @class NoUnaryVisitor
 * @extends {SubGenerator<T, N>}
 * @template {string} T - Extensible token type string vector.
 * @template {BaseNode<T>} N - Extensible abstract syntax tree node layout.
 */
export class NoUnaryVisitor<T extends string, N extends BaseNode<T>> extends SubGenerator<T, N> {
    /**
     * The node type string that triggers the activation of this specific sub-generator.
     * @public
     * @static
     */
    public static triggerToken: TokenTypeUnion<TokenType> | undefined = TokenType.NO_UNARIO;

    /**
     * Transpiles a logical negation unary node into a standard JavaScript inverted statement.
     * @param {NoUnaryNode<T, N>} node - The target operational negation tree node.
     * @returns {string} The formatted runnable native JavaScript logical inversion expression string.
     * @public
     */
    public visit(node: NoUnaryNode<T, N>): string {
        if (node.operator === 'NO') {
            return `!(${this.parent.visit(node.object)})`;
        }

        return '';
    }
}