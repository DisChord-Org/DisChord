import { SubParser } from "../../subparser";
import { ConditionNode, ASTNode, BaseNode, TokenType, TokenTypeUnion } from "../../../types";
import { ExpressionParser } from "../Expressions/ExpressionParser";
import { BlockParser } from "../BlockParser";
import { Parser } from "../../parser";

export class ConditionParser<T extends string, N extends BaseNode<T>> extends SubParser<T, N> {
    /** To identify when this parser should be used */
    static triggerToken: TokenType | undefined = TokenType.Si;

    /**
     * Collection of reserved keywords this specific sub-parser registers
     */
    static keywords: TokenTypeUnion<string>[] = [ TokenType.Si, TokenType.Ademas, TokenType.Sino ];

    /**
     * @param parent - Reference to the main Parser orchestrator.
     */
    constructor (protected parent: Parser<T, N>) {
        super(parent);
    }

    public parse(): ConditionNode<T, N> {
        this.consume(TokenType.Si);

        this.consume(TokenType.L_PAREN, `Después de 'si' se debe abrir una expresión con '(' para especificar la condición.`);
        const test = this.parent.get(ExpressionParser).parse();
        this.consume(TokenType.R_PAREN);

        this.consume(TokenType.L_BRACE, `Después de la condición de un 'si' se debe abrir un bloque de código con '{'.`);
        const consequent: ASTNode<T, N>[] = (this.parent.get(BlockParser) as BlockParser<T, N>).parse().body;
        this.consume(TokenType.R_BRACE);

        let alternate: ConditionNode<T, N>['alternate'] = undefined;

        if (this.match(TokenType.Ademas)) {
            alternate = this.parse();
        } else if (this.match(TokenType.Sino)) {
            this.consume(TokenType.L_BRACE, "Después de 'sino' se debe abrir un bloque con '{'.");
            alternate = (this.parent.get(BlockParser) as BlockParser<T, N>).parse().body;
            this.consume(TokenType.R_BRACE);
        }

        return this.createNode<ConditionNode<T, N>>({
            type: TokenType.CONDICION,
            test,
            consequent,
            alternate
        });
    }
}