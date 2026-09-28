import { ASTNode, BaseNode, BinaryExpressionNode, PrimitiveType, TokenType, TokenTypeUnion } from "../../types";
import { DataType, PrimitiveDataType } from "../../DataType";
import { SubInferrer } from "../SubInferrer";

/**
 * Infers a binary expression's result type from its operator, and — only for `mas`/`y`/`o`, whose
 * result depends on their operands' own types — by recursively inferring `node.left`/`node.right`
 * via `this.parent.infer`. See {@link numericOperators}/{@link comparisonOperators}'s own doc
 * comments for why the rest don't need that.
 */
export class BinaryExpressionInferrer<T extends string, N extends BaseNode<T>> extends SubInferrer<T, N> {
    public static triggerToken: TokenTypeUnion<TokenType> | undefined = TokenType.EXPRESION_BINARIA;

    /**
     * Every binary operator that always produces a JS `number` result regardless of its operands'
     * types — even `"a" - 1` is `NaN`, and `typeof NaN === 'number'` — so these can be inferred as
     * `numero` unconditionally, without needing to know the operand types at all. `mas` (`+`) is
     * deliberately excluded: unlike the others, it concatenates into a string when either operand
     * is one, so it needs its own operand-aware handling below.
     * @private
     * @readonly
     */
    private readonly numericOperators: readonly string[] = [
        TokenType.Menos, TokenType.Por, TokenType.Entre, TokenType.Exponente, TokenType.Resto
    ];

    /**
     * Every binary operator that always produces a JS `boolean` result regardless of its
     * operands' types — comparison always coerces to `true`/`false`. `y`/`o` (`&&`/`||`)
     * deliberately aren't here: JS's short-circuit evaluation returns whichever operand decided
     * the result, not necessarily a boolean, so those need their own operand-aware handling below.
     * @private
     * @readonly
     */
    private readonly comparisonOperators: readonly string[] = [
        TokenType.Igual, TokenType.IgualTipado, TokenType.Mayor, TokenType.Menor,
        TokenType.MayorIgual, TokenType.MenorIgual, TokenType.NoIgual, TokenType.NoIgualTipado
    ];

    public infer (node: ASTNode<T, N>): DataType | undefined {
        const binaryNode = node as BinaryExpressionNode<T, N>;

        if (this.numericOperators.includes(binaryNode.operator)) return PrimitiveDataType.of(PrimitiveType.Numero);
        if (this.comparisonOperators.includes(binaryNode.operator)) return PrimitiveDataType.of(PrimitiveType.Booleano);

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
