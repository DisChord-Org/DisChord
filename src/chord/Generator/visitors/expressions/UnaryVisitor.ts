import { UnaryNode, BaseNode, TokenType, TokenTypeUnion } from "../../../types";
import { SubGenerator } from "../../SubGenerator";

/**
 * Atomic SubGenerator compiling standard prefix unary expressions ('Unario').
 * Handles native language type checking and localization mappings.
 * @class UnaryVisitor
 * @extends {SubGenerator<T, N>}
 * @template {string} T - Extensible token type string vector.
 * @template {BaseNode<T>} N - Extensible abstract syntax tree node layout.
 */
export class UnaryVisitor<T extends string, N extends BaseNode<T>> extends SubGenerator<T, N> {
    /**
     * The node type string that triggers the activation of this specific sub-generator.
     * @public
     * @static
     */
    public static triggerToken: TokenTypeUnion<TokenType> | undefined = TokenType.UNARIO;

    /**
     * Transpiles a prefix unary operational node into JavaScript syntax.
     * @param {UnaryNode<T, N>} node - The target analytical unary operation tree node.
     * @returns {string} The formatted runnable native JavaScript unary expression string.
     * @public
     */
    public visit(node: UnaryNode<T, N>): string {
        if (node.operator === 'TIPO') {
            const mapping = `{ "number": "numero", "string": "texto", "boolean": "booleano", "undefined": "indefinido", "object": "objeto" }`;
            return `${mapping}[typeof (${this.parent.visit(node.object)})]`;
        }

        return '';
    }
}