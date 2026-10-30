import { ASTNode, BaseNode, CallNode, Symbol, TokenType, TokenTypeUnion } from "../../model/types";
import { isAccessNode, isIdentificatorNode } from "../../ast.guards";
import { DataType } from "../../model/DataType";

import { SubInferrer } from "../SubInferrer";
import { UserMemberResolver } from "../UserMemberResolver";

/**
 * Infers the type of a call. A function or method the file declares gives the return type its
 * signature declares (`-> booleano`), or `undefined` if it declares none; an async one gives the
 * type of the value it resolves to, since the call is awaited. A method is found through the class
 * of its receiver: an instance of a class of the file, `esta` or `super`. Any other call to a
 * method gives the `returns` of the core library member (`Mates.raizCuadrada(4)`,
 * `texto.partir(",")`), except a method a class of the file declares itself on a receiver of
 * unknown type (see `CoreLibUtils.resolveCallReturnType`). A free function that is not declared in
 * the file infers `undefined`.
 */
export class CallInferrer<T extends string, N extends BaseNode<T>> extends SubInferrer<T, N> {
    public static triggerToken: TokenTypeUnion<TokenType> | undefined = TokenType.LLAMADA;

    /**
     * The return type of a function or method: the declared one, or else the one inferred from its body.
     */
    private returnsOf (symbol: Symbol | undefined): DataType | undefined {
        return symbol?.signature?.returns ?? symbol?.signature?.inferredReturns;
    }

    public infer (node: ASTNode<T, N>): DataType | undefined {
        const callee = (node as CallNode<T, N>).object;
        const symbolTable = this.parent.context.symbolTable;

        if (isIdentificatorNode(callee)) return this.returnsOf(symbolTable.lookup(callee.value));
        if (!isAccessNode(callee)) return undefined;

        const receiverType = this.parent.infer(callee.object);
        const className = new UserMemberResolver(this.parent.context).className(callee, receiverType);
        if (className !== undefined) return this.returnsOf(symbolTable.classes.findMember(className, callee.property));

        return this.parent.context.coreLib.resolveCallReturnType(callee, receiverType, symbolTable.classes.hasMemberNamed(callee.property));
    }
}
