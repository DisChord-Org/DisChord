import { AccessNode, BaseNode, CompilerMetadataKind, Symbol, TokenType } from "../types";
import { isIdentificatorNode } from "../ast.guards";
import { DataType, UserClassDataType } from "../model/DataType";
import { CompilationContext } from "../../cli/commands/CompileCommand";

/**
 * Finds the member of a class of the file that a member access names, from what its receiver is:
 * `esta` (the enclosing class), `super` (its parent), an instance of a class of the file, or
 * the class itself (a static access). Used by every analysis step that needs the declaration
 * behind `objeto.metodo`, so they all agree on how a receiver is resolved.
 */
export class UserMemberResolver<T extends string> {
    constructor (private readonly context: CompilationContext<T>) {}

    /**
     * @param {AccessNode<T, N>} access - The member access.
     * @param {DataType} [receiverType] - The inferred type of `access.object`, if known.
     * @returns {string | undefined} The class of the file the receiver stands for, or `undefined`
     * if it isn't one.
     */
    public className<N extends BaseNode<T>> (access: AccessNode<T, N>, receiverType?: DataType): string | undefined {
        const symbolTable = this.context.symbolTable;
        const receiver = access.object;
        const currentClass = symbolTable.getMetadata<string>(CompilerMetadataKind.CurrentClass);

        let className: string | undefined;
        if (receiver.type === TokenType.Esta) className = currentClass;
        else if (receiver.type === TokenType.Super) className = currentClass === undefined ? undefined : symbolTable.superClassOf(currentClass);
        else if (receiverType instanceof UserClassDataType) className = receiverType.name;
        else if (isIdentificatorNode(receiver) && symbolTable.isUserClass(receiver.value)) className = receiver.value;

        return className;
    }

    /**
     * @param {AccessNode<T, N>} access - The member access.
     * @param {DataType} [receiverType] - The inferred type of `access.object`, if known.
     * @returns {Symbol | undefined} The declared member, or `undefined` if the receiver isn't a
     * class of the file or the class (and its parents in the file) has no such member.
     */
    public resolve<N extends BaseNode<T>> (access: AccessNode<T, N>, receiverType?: DataType): Symbol | undefined {
        const className = this.className(access, receiverType);
        return className === undefined ? undefined : this.context.symbolTable.findMember(className, access.property);
    }
}
