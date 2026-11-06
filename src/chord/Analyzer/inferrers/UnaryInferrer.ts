import { ASTNode, BaseNode, TokenType, TokenTypeUnion, UnaryNode } from "../../model/types";
import { DataType, PrimitiveDataType } from "../../model/DataType";
import { SubInferrer } from "../SubInferrer";

/**
 * Infers a prefix operation: `tipo x` is a `texto` (the name of the type of `x`). The negation
 * `no x` is inferred by `NoUnaryInferrer`.
 */
export class UnaryInferrer<T extends string, N extends BaseNode<T>> extends SubInferrer<T, N> {
    public static triggerToken: TokenTypeUnion<TokenType> | undefined = TokenType.UNARIO;

    public infer (node: ASTNode<T, N>): DataType | undefined {
        return (node as UnaryNode<T, N>).operator === TokenType.TIPO ? PrimitiveDataType.Texto : undefined;
    }
}
