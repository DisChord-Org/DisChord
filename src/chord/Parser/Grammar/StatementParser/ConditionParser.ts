import { SubParser } from "../../SubParser";
import { ConditionNode, ASTNode, BaseNode, TokenType, TokenTypeUnion } from "../../../types";
import { ExpressionParser } from "../Expressions/ExpressionParser";
import { BlockParser } from "../BlockParser";
import { Parser } from "../../Parser";

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

        const consequent: ASTNode<T, N>[] = (this.parent.get(BlockParser) as BlockParser<T, N>).parse().body;

        let alternate: ConditionNode<T, N>['alternate'] = undefined;

        if (this.match(TokenType.Ademas)) {
            alternate = this.parse();
        } else if (this.match(TokenType.Sino)) {
           alternate = (this.parent.get(BlockParser) as BlockParser<T, N>).parse().body;
        }

        return this.createNode<ConditionNode<T, N>>({
            type: TokenType.CONDICION,
            test,
            consequent,
            alternate
        });
    }
}