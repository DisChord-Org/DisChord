import { SubParser } from "../../subparser";
import { BaseNode, ReturnNode, TokenType } from "../../../types";
import { Parser } from "../../parser";

export class ReturnParser<T extends string, N extends BaseNode<T>> extends SubParser<T, N> {
    /** To identify when this parser should be used */
    static triggerToken: TokenType | undefined = TokenType.Devolver;

    /**
     * @param parent - Reference to the main Parser orchestrator.
     */
    constructor (protected parent: Parser<T, N>) {
        super(parent);
    }
    
    public parse(): ReturnNode<T, N> {
        this.consume(TokenType.Devolver);
        
        let value = undefined;
        const next = this.peek();

        const isEndOfStatement = ([ TokenType.R_BRACE, TokenType.Sino, TokenType.Ademas, TokenType.EOF ] as TokenType[]).includes(next.type);

        if (!isEndOfStatement) {
            value = this.parent.parseExpression();
        }

        return this.createNode<ReturnNode<T, N>>({
            type: TokenType.Devolver,
            object: value
        });
    }
}