import { ASTNode, AccessNode, BaseNode, TokenType, TokenTypeUnion } from "../../types";
import { DataType } from "../../DataType";
import { coreLibUtils } from "../../corelib";
import { SubInferrer } from "../SubInferrer";

/**
 * Infers the type of a core library property read (`Mates.PI`, `texto.longitud`) as that member's
 * `returns`. A method read without being called, or a property the core library doesn't define,
 * infers `undefined`, as does one a class of the file declares itself on a receiver of unknown type
 * (see `CoreLibUtils.resolveReturnType`).
 */
export class AccessInferrer<T extends string, N extends BaseNode<T>> extends SubInferrer<T, N> {
    public static triggerToken: TokenTypeUnion<TokenType> | undefined = TokenType.ACCESO;

    public infer (node: ASTNode<T, N>): DataType | undefined {
        const access = node as AccessNode<T, N>;
        return coreLibUtils.resolveReturnType(access, false, this.parent.infer(access.object), this.parent.context.symbolTable.hasMemberNamed(access.property));
    }
}
