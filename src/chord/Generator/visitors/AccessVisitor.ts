import { AccessNode, BaseNode, TokenType, TokenTypeUnion } from "../../types";
import { SubGenerator } from "../SubGenerator";
import { corelib } from "../core.lib";

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
        const objName = node.object.type === TokenType.IDENTIFICADOR ? node.object.value : null;
        const propName = node.property;

        if (objName && corelib.classes[objName] && corelib.classes[objName].methods[propName]) {
            return corelib.classes[objName].methods[propName];
        }

        for (const className in corelib.classes) {
            const methods = corelib.classes[className].methods;
            if (methods && methods[propName]) {
                return `${this.parent.visit(node.object)}.${methods[propName]}`;
            }
        }

        return `${this.parent.visit(node.object)}.${propName}`;
    }
}