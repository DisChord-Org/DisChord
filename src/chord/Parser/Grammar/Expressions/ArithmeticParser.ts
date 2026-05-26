import { Parser } from "../../parser";
import { ASTNode, BaseNode, BinaryExpressionNode, TokenType, TokenTypeUnion } from "../../../types";
import { SubParser } from "../../subparser";
import { UnaryParser } from "./UnaryParser";

export class ArithmeticParser<T extends string, N extends BaseNode<T>> extends SubParser<T, N> {
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
     * Consumes the arithmetic operators.
     */
    public parse(): ASTNode<T, N> {
        let left = this.parent.get(UnaryParser).parse();

        const highPriorityOps: TokenType[] = [ TokenType.Por, TokenType.Entre, TokenType.Resto, TokenType.Exponente ];

        while (highPriorityOps.includes(this.peek().type as TokenType)) {
            const operator = this.consume(this.peek().type);
            const right = this.parent.get(UnaryParser).parse();
            
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