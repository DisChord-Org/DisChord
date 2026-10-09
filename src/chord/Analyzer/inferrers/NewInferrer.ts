import { ASTNode, BaseNode, CallNode, NewNode, TokenType, TokenTypeUnion } from "../../types";
import { isIdentificatorNode } from "../../ast.guards";
import { DataType, UserClassDataType } from "../../model/DataType";

import { SubInferrer } from "../SubInferrer";

/**
 * Infers `nuevo Caja()` as an instance of that class. A class declared in the file prevails over
 * a core library class of the same name. Instantiating anything else infers `undefined`.
 */
export class NewInferrer<T extends string, N extends BaseNode<T>> extends SubInferrer<T, N> {
    public static triggerToken: TokenTypeUnion<TokenType> | undefined = TokenType.Nuevo;

    public infer (node: ASTNode<T, N>): DataType | undefined {
        const target = (node as NewNode<T, N>).object;
        const callee = target.type === TokenType.LLAMADA ? (target as CallNode<T, N>).object : target;

        if (isIdentificatorNode(callee) && this.parent.context.symbolTable.classes.isUserClass(callee.value)) {
            return UserClassDataType.of(callee.value);
        }

        return this.parent.context.coreLib.resolveConstructedType(target);
    }
}
