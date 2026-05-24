import { Parser } from "../../parser";
import { ASTNode, BaseNode, BinaryExpressionNode, TokenType } from "../../../types";
import { SubParser } from "../../subparser";
import { ArithmeticParser } from "./ArithmeticParser";

export class AditiveParser<T extends string, N extends BaseNode<T>> extends SubParser<T, N> {
    /** To identify when this parser should be used */
    static triggerToken: TokenType | undefined;

    /**
     * @param parent - Reference to the main Parser orchestrator.
     */
    constructor (protected parent: Parser<T, N>) {
        super(parent);
    }

    /**
     * Entry point for the SubParser.
     * Consumes the aditive operators.
     */
    public parse(): ASTNode<T, N> {
        let left = this.parent.get(ArithmeticParser).parse();

        const additiveOperators: TokenType[] = [ TokenType.Mas, TokenType.Menos, TokenType.Intro, TokenType.Espacio ];

        while (additiveOperators.includes(this.peek().type as TokenType)) {
            const operator = this.consume(this.peek().type);
            
            const right = this.parent.get(ArithmeticParser).parse();
            
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