import { ASTNode, BaseNode, CompilerMetadataKind, TokenType, TokenTypeUnion } from "../../types";
import { DataType, UserClassDataType } from "../../model/DataType";
import { SubInferrer } from "../SubInferrer";

/**
 * Infers `esta` as an instance of the class whose body encloses it. Outside any class it infers
 * `undefined`.
 */
export class ThisInferrer<T extends string, N extends BaseNode<T>> extends SubInferrer<T, N> {
    public static triggerToken: TokenTypeUnion<TokenType> | undefined = TokenType.Esta;

    public infer (_node: ASTNode<T, N>): DataType | undefined {
        const className = this.parent.context.symbolTable.getMetadata<string>(CompilerMetadataKind.CurrentClass);
        return className === undefined ? undefined : UserClassDataType.of(className);
    }
}
