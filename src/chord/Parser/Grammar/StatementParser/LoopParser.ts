import { SubParser } from "../../SubParser";
import { LoopNode, BaseNode, DeclarationKind, TokenType, TokenTypeUnion } from "../../../model/types";
import { ExpressionParser } from "../Expressions/ExpressionParser";

export class LoopParser<T extends string, N extends BaseNode<T>> extends SubParser<T, N> {
    /** To identify when this parser should be used */
    static triggerToken: TokenType | undefined = TokenType.Para;

    /**
     * Collection of reserved keywords this specific sub-parser registers
     */
    static keywords: TokenTypeUnion<string>[] = [ TokenType.Para, TokenType.En ];

    public parse(): LoopNode<T, N> {
        this.consume(TokenType.Para);
        this.consume(TokenType.L_PAREN, "Después de 'para' se debe abrir una expresión con '(' para definir la variable y el iterable del bucle.");
        
        const variable = this.declare(DeclarationKind.Variable, this.consume(TokenType.IDENTIFICADOR, "Se debe especificar un nombre para la variable del bucle."));
        this.consume(TokenType.En, "Se esperaba la palabra 'en' para definir el iterable.");
        
        const iterable = this.parent.get(ExpressionParser).parse();
        this.consume(TokenType.R_PAREN);

        const body = this.parseBlockBody();

        return this.createNode<LoopNode<T, N>>({
            type: TokenType.BUCLE,
            var: variable,
            iterable,
            body
        });
    }
}