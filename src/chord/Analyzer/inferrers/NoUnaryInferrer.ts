import { ASTNode, BaseNode, TokenType, TokenTypeUnion } from "../../model/types";
import { DataType, PrimitiveDataType } from "../../model/DataType";
import { SubInferrer } from "../SubInferrer";

/**
 * Infers a negation (`no x`) as a `booleano` whatever `x` is, since it is `!x`.
 */
export class NoUnaryInferrer<T extends string, N extends BaseNode<T>> extends SubInferrer<T, N> {
    public static triggerToken: TokenTypeUnion<TokenType> | undefined = TokenType.NO_UNARIO;

    public infer (_node: ASTNode<T, N>): DataType | undefined {
        return PrimitiveDataType.Booleano;
    }
}
