import { ASTNode, BaseNode, BinaryExpressionNode, TokenType } from "../../../model/types";
import { SubParser } from "../../SubParser";

/**
 * One precedence level of the left-associative binary operators: `operand (operator operand)*`.
 * A level only says which operators it owns and which level sits right below it.
 */
export abstract class BinaryLevelParser<T extends string, N extends BaseNode<T>> extends SubParser<T, N> {
    /** The operators this level consumes. */
    protected abstract readonly operators: readonly string[];

    /** Parses one operand: the level right below this one. */
    protected abstract operand(): ASTNode<T, N>;

    public parse(): ASTNode<T, N> {
        let left = this.operand();

        while (this.operators.includes(this.peek().type)) {
            const operator = this.consume(this.peek().type);
            const right = this.operand();

            left = this.createNode<BinaryExpressionNode<T, N>>({
                type: TokenType.EXPRESION_BINARIA,
                left,
                operator: operator.type,
                right
            });
        }

        return left;
    }
}
