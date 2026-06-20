import { PropertyNode, BaseNode, TokenType, TokenTypeUnion } from "../../../types";
import { SubGenerator } from "../../SubGenerator";

/**
 * Atomic SubGenerator compiling raw class state attributes or properties declarations.
 * @class PropertyVisitor
 * @extends {SubGenerator<T, N>}
 * @template {string} T - Extensible token type string vector.
 * @template {BaseNode<T>} N - Extensible abstract syntax tree node layout.
 */
export class PropertyVisitor<T extends string, N extends BaseNode<T>> extends SubGenerator<T, N> {
    /**
     * The node type string that triggers the activation of this specific sub-generator.
     * @public
     * @static
     */
    public static triggerToken: TokenTypeUnion<TokenType> | undefined = TokenType.PROPIEDAD;

    /**
     * Transpiles explicit inline class properties definitions with structural assignments fallbacks.
     * @param {PropertyNode<T, N>} node - The target property analytical tree node.
     * @returns {string} The runnable native JavaScript property execution statement string.
     * @public
     */
    public visit(node: PropertyNode<T, N>): string {
        const isStatic = node.isStatic ? 'static ' : '';
        const init = node.value ? ` = ${this.parent.visit(node.value)}` : '';
        return `${isStatic}${node.id}${init}`;
    }
}