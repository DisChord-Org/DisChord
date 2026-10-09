import { AccessNode, BaseNode, TokenType, TokenTypeUnion } from "../../../types";
import { SubGenerator } from "../../SubGenerator";

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
     * Emits a member access with the name the Analyzer decided for it (see
     * `ResolveMemberAccessesRule`): the JavaScript name of the core library member it stands for,
     * or the name as written, or a call to the runtime helper it decided to read the member through. A static core library access is emitted as its own translation.
     * @param {AccessNode<T>} node - The target field access syntax tree node.
     * @returns {string} The fully resolved and chained member dot-notation string.
     * @public
     */
    public visit(node: AccessNode<T, N>): string {
        const staticMember = this.parent.context.coreLib.resolveStatic(node);
        if (staticMember) return staticMember.member.transpile;

        const marks = this.parent.context.symbolTable.marks;

        const helper = marks.memberHelperOf(node);
        if (helper) return `${helper}(${this.parent.visit(node.object)})`;

        const property = marks.memberOf(node) ?? node.property;

        const receiver = this.parent.visit(node.object);
        return `${receiver.startsWith('await ') ? `(${receiver})` : receiver}.${property}`;
    }
}