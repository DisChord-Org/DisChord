import { ASTNode, BaseNode, NewNode, TokenType, TokenTypeUnion } from "../../types";
import { DataType } from "../../DataType";
import { coreLibUtils } from "../../corelib";
import { SubInferrer } from "../SubInferrer";

/**
 * Infers `nuevo Mapa()` as an instance of that core library class. Instantiating anything else (a
 * user class, which has no type of its own yet) infers `undefined`.
 */
export class NewInferrer<T extends string, N extends BaseNode<T>> extends SubInferrer<T, N> {
    public static triggerToken: TokenTypeUnion<TokenType> | undefined = TokenType.Nuevo;

    public infer (node: ASTNode<T, N>): DataType | undefined {
        return coreLibUtils.resolveConstructedType((node as NewNode<T, N>).object);
    }
}
