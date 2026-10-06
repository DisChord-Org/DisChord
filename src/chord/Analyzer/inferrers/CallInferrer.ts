import { ASTNode, AccessNode, BaseNode, CallNode, TokenType, TokenTypeUnion } from "../../types";
import { DataType } from "../../DataType";
import { coreLibUtils } from "../../corelib";
import { SubInferrer } from "../SubInferrer";

/**
 * Infers the type of a call to a core library method (`Mates.raizCuadrada(4)`, `texto.partir(",")`)
 * as that member's `returns`. A call to anything else (a user function, which has no declared
 * return type yet, or a free function) infers `undefined`.
 */
export class CallInferrer<T extends string, N extends BaseNode<T>> extends SubInferrer<T, N> {
    public static triggerToken: TokenTypeUnion<TokenType> | undefined = TokenType.LLAMADA;

    public infer (node: ASTNode<T, N>): DataType | undefined {
        const callee = (node as CallNode<T, N>).object;
        if (callee.type !== TokenType.ACCESO) return undefined;

        const access = callee as AccessNode<T, N>;
        return coreLibUtils.resolveReturnType(access, true, this.parent.infer(access.object));
    }
}
