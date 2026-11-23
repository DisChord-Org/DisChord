import { AnalysisRule } from "../AnalysisRule";
import { ASTNode, AccessNode, BaseNode } from "../../model/types";
import { isAccessNode } from "../../ast.guards";
import { AnyDataType } from "../../model/DataType";
import { Suggestion } from "../../../utils/Suggestion";

/**
 * Rejects a member that a value of a known type does not have: `t.noExiste()` on a `texto`, or
 * `m.guardar("a", 1)` on a `Mapa`, would compile and fail only when run. It only speaks for the closed
 * classes of the core library (see `CoreLibClass.native`), and for them a member is known when the table
 * has it or the JavaScript class behind has it (`t.toUpperCase()`), which works as written. A receiver of
 * unknown type or `cualquiera` is not checked, and neither is a union that belongs to no single class
 * (`texto|numero`), an open class (a `bdo`, whose fields are the user's) nor an access through the
 * class itself (`Mates.x`), whose receiver has no type.
 *
 * Runs after every variable's type is resolved, walking the tree with the same scopes as the earlier passes.
 */
export class ValidateKnownMembersRule<T extends string, N extends BaseNode<T>> extends AnalysisRule<T, N> {
    /** With no member to suggest, the members of the class are listed if they are no more than these. */
    private static readonly ListedMembers = 10;

    /**
     * @override
     */
    check (nodes: ASTNode<T, N>[]): void {
        this.walkScoped(nodes, current => {
            if (isAccessNode(current)) this.validate(current);
        });
    }

    /**
     * @throws {DisChordError} If the type of the receiver is of a closed class that has no such member.
     * @private
     */
    private validate (access: AccessNode<T, N>): void {
        const coreLib = this.context.coreLib;
        const receiverType = this.inferrer.infer(access.object);
        if (!receiverType || receiverType instanceof AnyDataType) return;

        const className = coreLib.classOf(receiverType);
        if (className === undefined || !coreLib.isClosed(className)) return;

        const members = coreLib.instanceMemberNames(className);
        if (members.includes(access.property) || coreLib.hasNativeMember(className, access.property)) return;

        this.fail(`'${access.property}' no existe en un valor de tipo '${receiverType.format()}'.${this.hint(access.property, className, members)}`, access);
    }

    /**
     * @returns {string} What to add to the message: the member that was probably meant, or the ones there are when they are few.
     * @private
     */
    private hint (name: string, className: string, members: string[]): string {
        const suggestion = Suggestion.didYouMean(name, members);

        if (suggestion) return suggestion;

        return members.length <= ValidateKnownMembersRule.ListedMembers ? ` ${className} tiene: ${members.join(' / ')}.` : '';
    }
}
