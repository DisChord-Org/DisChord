import { ASTNode, BaseNode, CallNode, TokenType, TokenTypeUnion } from "../../types";
import { isAccessNode } from "../../ast.guards";
import { DataType } from "../../DataType";
import { coreLibUtils } from "../../corelib";
import { SubInferrer } from "../SubInferrer";

/**
 * Infers the type of a call to a core library method (`Mates.raizCuadrada(4)`, `texto.partir(",")`)
 * as that member's `returns`. A call to anything else (a user function, which has no declared
 * return type yet, or a free function) infers `undefined`, as does a method a class of the file declares itself
 * on a receiver of unknown type (see `CoreLibUtils.resolveReturnType`).
 */
export class CallInferrer<T extends string, N extends BaseNode<T>> extends SubInferrer<T, N> {
    public static triggerToken: TokenTypeUnion<TokenType> | undefined = TokenType.LLAMADA;

    public infer (node: ASTNode<T, N>): DataType | undefined {
        const callee = (node as CallNode<T, N>).object;
        if (!isAccessNode(callee)) return undefined;

        return coreLibUtils.resolveReturnType(callee, true, this.parent.infer(callee.object), this.parent.context.symbolTable.hasMemberNamed(callee.property));
    }
}
