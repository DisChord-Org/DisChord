import { ASTNode, BaseNode, ODBMode, ODBNode, TokenType, TokenTypeUnion } from "../../types";
import { DataType, PrimitiveDataType } from "../../DataType";
import { SubInferrer } from "../SubInferrer";

/**
 * Infers a simple BDO (`{ clave valor }`) as a `bdo`. An intelligent-mode BDO isn't inferred: it
 * compiles to a closure whose result can be a plain statement list instead of an object.
 */
export class BDOInferrer<T extends string, N extends BaseNode<T>> extends SubInferrer<T, N> {
    public static triggerToken: TokenTypeUnion<TokenType> | undefined = TokenType.BDO;

    public infer (node: ASTNode<T, N>): DataType | undefined {
        return (node as ODBNode<T, N>).mode === ODBMode.Simple ? PrimitiveDataType.BDO : undefined;
    }
}
