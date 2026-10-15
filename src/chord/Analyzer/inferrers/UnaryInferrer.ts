import { ASTNode, BaseNode, TokenType, TokenTypeUnion, UnaryNode } from "../../model/types";
import { DataType, PrimitiveDataType } from "../../model/DataType";
import { SubInferrer } from "../SubInferrer";

/**
 * Infers a prefix operation: `no x` is always a `booleano` whatever `x` is (it is `!x`), and `tipo x`
 * is a `texto` (the name of the type of `x`).
 */
export class UnaryInferrer<T extends string, N extends BaseNode<T>> extends SubInferrer<T, N> {
    public static triggerToken: TokenTypeUnion<TokenType> | undefined = TokenType.UNARIO;

    public infer (node: ASTNode<T, N>): DataType | undefined {
        return (node as UnaryNode<T, N>).operator === TokenType.TIPO ? PrimitiveDataType.Texto : undefined;
    }
}
