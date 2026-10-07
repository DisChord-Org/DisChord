import { AccessNode, BaseNode, TokenType, TokenTypeUnion } from "../../../types";
import { SubGenerator } from "../../SubGenerator";
import { coreLibUtils } from "../../../corelib";
import { TypeInferrer } from "../../../Analyzer/TypeInferrer";
import { AnyDataType } from "../../../DataType";

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
     * Infers the receiver's type, so a member is picked through the class that type belongs to (the
     * analyzer resolves it the same way). Like the analyzer, it only knows the types of variables
     * the `SymbolTable` still holds, which doesn't include the locals of a function or class.
     * @private
     * @readonly
     */
    private readonly typeInferrer: TypeInferrer<T, N> = new TypeInferrer(this.parent.context);

    /**
     * Evaluates a property accessor structure routing matches directly into core polyfills. A member
     * a class of the file declares keeps its name when the receiver's type is unknown (see
     * `CoreLibUtils.resolveInstanceMember`), and so does a member of the core library used as a field on a
     * receiver of unknown type (see `SymbolTable.roleOf`).
     * @param {AccessNode<T>} node - The target field access syntax tree node.
     * @returns {string} The fully resolved and chained member dot-notation string.
     * @public
     */
    public visit(node: AccessNode<T, N>): string {
        const staticMember = coreLibUtils.resolveStatic(node);
        if (staticMember) return staticMember.member.transpile;

        const receiverType = this.typeInferrer.infer(node.object);
        const declaredByUser = this.parent.context.symbolTable.hasMemberNamed(node.property);
        const resolved = coreLibUtils.resolveInstanceMember(node, receiverType, declaredByUser);

        const role = this.parent.context.symbolTable.roleOf(node);
        const isUnknownReceiver = !receiverType || receiverType instanceof AnyDataType;
        const isFieldUse = resolved && isUnknownReceiver && (resolved.isProperty ? role !== 'read' : role !== 'callee');

        const property = resolved && !isFieldUse ? resolved.member.transpile : node.property;

        const receiver = this.parent.visit(node.object);
        return `${receiver.startsWith('await ') ? `(${receiver})` : receiver}.${property}`;
    }
}