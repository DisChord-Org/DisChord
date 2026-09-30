import { AccessNode, BaseNode, TokenType, TokenTypeUnion } from "../../../types";
import { SubGenerator } from "../../SubGenerator";
import { CoreLibUtils } from "../../corelib";

/**
 * Atomic SubGenerator mapping properties, fields, and core native dictionary methods.
 * @class AccessVisitor
 * @extends {SubGenerator<T, N>}
 * @template {string} T - Extensible token type string vector.
 * @template {BaseNode<T>} N - Extensible abstract syntax tree node layout.
 */
export class AccessVisitor<T extends string, N extends BaseNode<T>> extends SubGenerator<T, N> {
    /**
     * The node type string that triggers the activation of this specific sub-generator.
     * @public
     * @static
     */
    public static triggerToken: TokenTypeUnion<TokenType> | undefined = TokenType.ACCESO;

    /**
     * Evaluates a property accessor structure routing matches directly into core polyfills.
     * @param {AccessNode<T>} node - The target field access syntax tree node.
     * @returns {string} The fully resolved and chained member dot-notation string.
     * @public
     */
    public visit(node: AccessNode<T, N>): string {
        const staticMember = CoreLibUtils.resolveStatic(node);
        if (staticMember) return staticMember.member.transpile;

        const property = CoreLibUtils.resolveInstance(node)?.member.transpile ?? node.property;

        return `${this.parent.visit(node.object)}.${property}`;
    }
}