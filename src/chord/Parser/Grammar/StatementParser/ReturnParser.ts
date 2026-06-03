import { SubParser } from "../../subparser";
import { BaseNode, ReturnNode, TokenType, TokenTypeUnion } from "../../../types";
import { Parser } from "../../Parser";
import { ExpressionParser } from "../Expressions/ExpressionParser";

export class ReturnParser<T extends string, N extends BaseNode<T>> extends SubParser<T, N> {
    /** To identify when this parser should be used */
    static triggerToken: TokenType | undefined = TokenType.Devolver;

    /**
     * Collection of reserved keywords this specific sub-parser registers
     */
    static keywords: TokenTypeUnion<string>[] = [ TokenType.Devolver ];

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

        const isEndOfStatement = ([ TokenType.R_BRACE, TokenType.Sino, TokenType.Ademas, TokenType.EOF ] as TokenType[]).includes(next.type as TokenType);

        if (!isEndOfStatement) {
            value = this.parent.get(ExpressionParser).parse();
        }

        return this.createNode<ReturnNode<T, N>>({
            type: TokenType.Devolver,
            object: value
        });
    }
}