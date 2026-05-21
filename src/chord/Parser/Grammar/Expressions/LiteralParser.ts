import { SubParser } from "../../subparser";
import { ASTNode, BaseNode, LiteralNode, TokenType } from "../../../types";
import { Parser } from "../../parser";

export class LiteralParser<T extends string, N extends BaseNode<T>> extends SubParser<T, N> {
    /** To identify when this parser should be used */
    static triggerToken: TokenType | undefined;
    
    constructor(parent: Parser<T, N>) {
        super(parent);
    }

    public parse(): ASTNode<T, N> {

        const token = this.consume([ TokenType.NUMERO, TokenType.BIGINT, TokenType.BOOLEANO, TokenType.TEXTO, TokenType.Indefinido ], `Se esperaba un literal (número, texto, booleano o indefinido)`);

        let value: boolean | number | string | undefined = token.value;

        switch (token.type) {
            case TokenType.BOOLEANO:
                value = token.value === TokenType.Verdadero;
                break;
            case TokenType.NUMERO:
            case TokenType.BIGINT:
                value = Number(token.value);
                break;
            case TokenType.Indefinido:
                value = undefined;
                break;
        }

        return this.createNode<LiteralNode<T>>({
            type: TokenType.LITERAL,
            value,
            raw: token.value
        });
    }
}