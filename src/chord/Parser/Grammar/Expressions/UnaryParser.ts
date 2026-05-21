import { Parser } from "../../parser";
import { ASTNode, BaseNode, NoUnaryNode, TokenType, UnaryNode } from "../../../types";
import { SubParser } from "../../subparser";
import { PrimaryParser } from "../PrimaryParser/PrimaryParser";

export class UnaryParser<T extends string, N extends BaseNode<T>> extends SubParser<T, N> {
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
     * Consumes the unary operators.
     */
    public parse(): ASTNode<T, N> {
        const token = this.peek();

        if (token.type === TokenType.No) {
            this.consume(TokenType.No);
            const argument = this.parse();
            return this.createNode<NoUnaryNode<T, N>>({
                type: TokenType.NO_UNARIO,
                operator: TokenType.No,
                object: argument
            });
        }

        if (token.type === TokenType.TIPO) {
            this.consume(TokenType.TIPO);
            const argument = this.parse();
            return this.createNode<UnaryNode<T, N>>({
                type: TokenType.UNARIO,
                operator: TokenType.TIPO,
                object: argument
            });
        }

        return this.parent.get(PrimaryParser).parse();
    }
}