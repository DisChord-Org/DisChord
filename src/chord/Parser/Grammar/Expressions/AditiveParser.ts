import { Parser } from "../../Parser";
import { ASTNode, BaseNode, BinaryExpressionNode, TokenType, TokenTypeUnion } from "../../../types";
import { SubParser } from "../../SubParser";
import { ArithmeticParser } from "./ArithmeticParser";

export class AditiveParser<T extends string, N extends BaseNode<T>> extends SubParser<T, N> {
    /** To identify when this parser should be used */
    static triggerToken: TokenType | undefined;

    /**
     * Collection of reserved keywords this specific sub-parser registers
     */
    static keywords: TokenTypeUnion<string>[] = [ TokenType.Mas, TokenType.Menos ];

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

        while (AditiveParser.keywords.includes(this.peek().type as TokenType)) {
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