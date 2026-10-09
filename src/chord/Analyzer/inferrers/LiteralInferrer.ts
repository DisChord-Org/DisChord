import { ASTNode, BaseNode, LiteralNode, TokenType, TokenTypeUnion } from "../../types";
import { DataType, PrimitiveDataType } from "../../model/DataType";
import { SubInferrer } from "../SubInferrer";

/** Infers a literal's `DataType` directly from its native JS value via `PrimitiveDataType.fromJSValue`. */
export class LiteralInferrer<T extends string, N extends BaseNode<T>> extends SubInferrer<T, N> {
    public static triggerToken: TokenTypeUnion<TokenType> | undefined = TokenType.LITERAL;

    public infer (node: ASTNode<T, N>): DataType | undefined {
        return PrimitiveDataType.fromJSValue((node as LiteralNode<T>).value);
    }
}
