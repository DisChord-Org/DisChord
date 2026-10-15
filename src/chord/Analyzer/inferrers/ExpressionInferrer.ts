import { ASTNode, BaseNode, ExpressionNode, TokenType, TokenTypeUnion } from "../../model/types";
import { DataType } from "../../model/DataType";
import { SubInferrer } from "../SubInferrer";

/**
 * Infers a parenthesized expression as the type of what is inside the parentheses: grouping does not
 * change a value's type. An interpolated text (`"hola {nombre}"`) is one of these, as it reaches the
 * analyzer as `("hola " mas (nombre))`, so this is also what types it as a text.
 */
export class ExpressionInferrer<T extends string, N extends BaseNode<T>> extends SubInferrer<T, N> {
    public static triggerToken: TokenTypeUnion<TokenType> | undefined = TokenType.EXPRESION;

    public infer (node: ASTNode<T, N>): DataType | undefined {
        return this.parent.infer((node as ExpressionNode<T, N>).object);
    }
}
