import { ASTNode, BaseNode, IdentificatorNode, TokenType, TokenTypeUnion } from "../../types";
import { DataType } from "../../DataType";
import { SubInferrer } from "../SubInferrer";

/**
 * Infers an identifier's `DataType` as whatever the `SymbolTable` already resolved for it — only
 * meaningful for a variable declared earlier in the same pass, or in an enclosing scope.
 */
export class IdentifierInferrer<T extends string, N extends BaseNode<T>> extends SubInferrer<T, N> {
    public static triggerToken: TokenTypeUnion<TokenType> | undefined = TokenType.IDENTIFICADOR;

    public infer (node: ASTNode<T, N>): DataType | undefined {
        return this.parent.context.symbolTable.lookup((node as IdentificatorNode<T>).value)?.dataType;
    }
}
