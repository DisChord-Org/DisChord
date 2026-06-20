import { ExportNode, BaseNode, TokenType, TokenTypeUnion } from "../../../types";
import { SubGenerator } from "../../SubGenerator";

/**
 * Atomic SubGenerator to compile Chord language module export directives.
 * @class ExportVisitor
 * @extends {SubGenerator<T, N>}
 * @template {string} T - Extensible token type string vector.
 * @template {BaseNode<T>} N - Extensible abstract syntax tree node layout.
 */
export class ExportVisitor<T extends string, N extends BaseNode<T>> extends SubGenerator<T, N> {
    /**
     * The node type string that triggers the activation of this specific sub-generator.
     * @public
     * @static
     */
    public static triggerToken: TokenTypeUnion<TokenType> | undefined = TokenType.Exportar;

    /**
     * Transpiles an Export statement node down to an ECMAScript standard export expression.
     * @param {ExportNode<T, N>} node - The target export specification syntax tree node.
     * @returns {string} The formatted runnable native JavaScript module export statement.
     * @public
     */
    public visit(node: ExportNode<T, N>): string {
        const innerNode = node.object;

        if (innerNode.type === 'Identificador') {
            return `export { ${this.parent.visit(innerNode)} }`;
        }

        return `export ${this.parent.visit(innerNode)}`;
    }
}