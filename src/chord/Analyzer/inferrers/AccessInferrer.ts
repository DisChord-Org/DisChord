import { ASTNode, AccessNode, BaseNode, TokenType, TokenTypeUnion } from "../../types";
import { DataType } from "../../model/DataType";

import { SubInferrer } from "../SubInferrer";

/**
 * Infers the type of a core library property read (`Mates.PI`, `texto.longitud`) as that member's
 * `returns`. A method read without being called, or a property the core library doesn't define,
 * infers `undefined`, as does one a class of the file declares itself on a receiver of unknown type
 * (see `CoreLibUtils.resolvePropertyType`).
 */
export class AccessInferrer<T extends string, N extends BaseNode<T>> extends SubInferrer<T, N> {
    public static triggerToken: TokenTypeUnion<TokenType> | undefined = TokenType.ACCESO;

    public infer (node: ASTNode<T, N>): DataType | undefined {
        const access = node as AccessNode<T, N>;
        const infered = this.parent.infer(access.object);
        const isClassMember = this.parent.context.symbolTable.classes.hasMemberNamed(access.property);

        return this.parent.context.coreLib.resolvePropertyType(access, infered, isClassMember);
    }
}
