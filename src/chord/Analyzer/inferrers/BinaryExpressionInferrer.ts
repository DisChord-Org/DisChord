import { ASTNode, BaseNode, BinaryExpressionNode, ComparisonOperators, NumericOperators, PrimitiveType, TokenType, TokenTypeUnion } from "../../types";
import { DataType, PrimitiveDataType } from "../../DataType";
import { SubInferrer } from "../SubInferrer";

/**
 * Infers a binary expression's result type from its operator, and — only for `mas`/`y`/`o`, whose
 * result depends on their operands' own types — by recursively inferring `node.left`/`node.right`
 * via `this.parent.infer`. See `NumericOperators`/`ComparisonOperators`' own doc
 * comments in `types.ts` for why the rest don't need that.
 */
export class BinaryExpressionInferrer<T extends string, N extends BaseNode<T>> extends SubInferrer<T, N> {
    public static triggerToken: TokenTypeUnion<TokenType> | undefined = TokenType.EXPRESION_BINARIA;

    public infer (node: ASTNode<T, N>): DataType | undefined {
        const binaryNode = node as BinaryExpressionNode<T, N>;

        if ((NumericOperators as readonly string[]).includes(binaryNode.operator)) return PrimitiveDataType.of(PrimitiveType.Numero);
        if ((ComparisonOperators as readonly string[]).includes(binaryNode.operator)) return PrimitiveDataType.of(PrimitiveType.Booleano);

        if (binaryNode.operator === TokenType.Mas) {
            const left = this.parent.infer(binaryNode.left);
            const right = this.parent.infer(binaryNode.right);
            if (left === undefined || right === undefined) return undefined;

            const textLike = PrimitiveDataType.of(PrimitiveType.Texto);
            if (textLike.isAssignableFrom(left) || textLike.isAssignableFrom(right)) return textLike;

            const numberLike = PrimitiveDataType.of(PrimitiveType.Numero);
            if (numberLike.isAssignableFrom(left) && numberLike.isAssignableFrom(right)) return numberLike;

            return undefined;
        }

        if (binaryNode.operator === TokenType.Y || binaryNode.operator === TokenType.O) {
            const boolLike = PrimitiveDataType.of(PrimitiveType.Booleano);
            const left = this.parent.infer(binaryNode.left);
            const right = this.parent.infer(binaryNode.right);

            return left && right && boolLike.isAssignableFrom(left) && boolLike.isAssignableFrom(right) ? boolLike : undefined;
        }

        return undefined;
    }
}
