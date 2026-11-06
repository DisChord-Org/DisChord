import { SubParser } from "../../SubParser";
import { ASTNode, BaseNode, ReturnNode, TokenType, TokenTypeUnion } from "../../../model/types";
import { ExpressionParser } from "../Expressions/ExpressionParser";

export class ReturnParser<T extends string, N extends BaseNode<T>> extends SubParser<T, N> {
    /** To identify when this parser should be used */
    static triggerToken: TokenType | undefined = TokenType.Devolver;

    /**
     * Collection of reserved keywords this specific sub-parser registers
     */
    static keywords: TokenTypeUnion<string>[] = [ TokenType.Devolver ];

    /** What can follow `devolver` when it returns nothing. */
    private static readonly END_OF_STATEMENT: readonly string[] = [ TokenType.R_BRACE, TokenType.Sino, TokenType.Ademas, TokenType.EOF ];

    public parse(): ReturnNode<T, N> {
        this.consume(TokenType.Devolver);
        
        let value: ASTNode<T, N> | undefined = undefined;
        const next = this.peek();

        if (!ReturnParser.END_OF_STATEMENT.includes(next.type)) {
            value = this.parent.get(ExpressionParser).parse();
        }

        return this.createNode<ReturnNode<T, N>>({
            type: TokenType.Devolver,
            object: value
        });
    }
}