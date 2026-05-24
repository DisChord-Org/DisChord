import { SubParser } from "../../subparser";
import { LoopNode, BaseNode, TokenType } from "../../../types";
import { BlockParser } from "../BlockParser";
import { Parser } from "../../parser";

export class LoopParser<T extends string, N extends BaseNode<T>> extends SubParser<T, N> {
    /** To identify when this parser should be used */
    static triggerToken: TokenType | undefined = TokenType.Para;

    /**
     * @param parent - Reference to the main Parser orchestrator.
     */
    constructor (protected parent: Parser<T, N>) {
        super(parent);
    }
    
    public parse(): LoopNode<T, N> {
        this.consume(TokenType.Para);
        this.consume(TokenType.L_PAREN, "Después de 'para' se debe abrir una expresión con '(' para definir la variable y el iterable del bucle.");
        
        const variable = this.consume(TokenType.IDENTIFICADOR, "Se debe especificar un nombre para la variable del bucle.").value;
        this.consume(TokenType.En, "Se esperaba la palabra 'en' para definir el iterable.");
        
        const iterable = this.parent.parseExpression();
        this.consume(TokenType.R_PAREN);

        const body = (this.parent.get(BlockParser) as BlockParser<T, N>).parse().body;

        return this.createNode<LoopNode<T, N>>({
            type: TokenType.BUCLE,
            var: variable,
            iterable,
            body
        });
    }
}