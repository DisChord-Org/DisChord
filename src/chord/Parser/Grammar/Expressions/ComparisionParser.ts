import { Parser } from "../../parser";
import { ASTNode, BaseNode, BinaryExpressionNode, TokenType, TokenTypeUnion } from "../../../types";
import { SubParser } from "../../subparser";
import { AditiveParser } from "./AditiveParser";

export class ComparisionParser<T extends string, N extends BaseNode<T>> extends SubParser<T, N> {
    /** To identify when this parser should be used */
    static triggerToken: TokenType | undefined;

    /**
     * Collection of reserved keywords this specific sub-parser registers
     */
    static keywords: TokenTypeUnion<string>[] = [];

    /**
     * @param parent - Reference to the main Parser orchestrator.
     */
    constructor (protected parent: Parser<T, N>) {
        super(parent);
    }

    /**
     * Entry point for the SubParser.
     * Consumes the comparision operators.
     */
    public parse(): ASTNode<T, N> {
        let left = this.parent.get(AditiveParser).parse();

        const comparisonOperators: TokenType[] = [
            TokenType.Mayor, TokenType.Menor, TokenType.MayorIgual, TokenType.MenorIgual,
            TokenType.Igual, TokenType.IgualTipado, TokenType.NoIgual, TokenType.NoIgualTipado, TokenType.No
        ];

        while (comparisonOperators.includes(this.peek().type as TokenType)) {
            const operator = this.consume(this.peek().type);
            
            const right = this.parent.get(AditiveParser).parse();
            
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