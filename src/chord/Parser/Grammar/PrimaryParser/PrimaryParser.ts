import { SubParser } from "../../subparser";
import { ASTNode, BaseNode, ExpressionNode, JSNode, ListNode, NewNode, ODBMode, TokenType } from "../../../types";
import { ExpressionParser } from "../Expressions/ExpressionParser";
import { AssignmentParser } from "../Expressions/AssignmentParser";
import { DecoratorProcessor } from "../../../DecoratorProcessor";
import { ChordError, ErrorLevel } from "../../../../ChordError";
import { BDOParser } from "../BDOParser";
import { LiteralParser } from "../Expressions/LiteralParser";
import { AccessParser } from "../Expressions/AccessParser";
import { Parser } from "../../parser";

export class PrimaryParser<T extends string, N extends BaseNode<T>> extends SubParser<T, N> {
    /** To identify when this parser should be used */
    static triggerToken: TokenType | undefined;

    /**
     * @param parent - Reference to the main Parser orchestrator.
     */
    constructor (protected parent: Parser<T, N>) {
        super(parent);
    }
    
    public parse(): ASTNode<T, N> {
        const token = this.peek();

        if (token.type === TokenType.Nuevo) {
            this.consume(TokenType.Nuevo);
            const call = this.parent.get(AccessParser).parse(); 
            return this.createNode<NewNode<T, N>>({
                type: TokenType.Nuevo,
                object: call
            });
        }

        if (token.type === TokenType.L_SQUARE) {
            this.consume(TokenType.L_SQUARE);
            const elements: ASTNode<T, N>[] = [];
            while (this.peek().type !== TokenType.R_SQUARE) {
                elements.push(this.parent.get(AssignmentParser).parse());
                if (this.peek().type === TokenType.COMA) this.consume(TokenType.COMA);
            }
            this.consume(TokenType.R_SQUARE);
            return this.createNode<ListNode<T, N>>({
                type: TokenType.LISTA,
                body: elements
            });
        }

        if (token.type === TokenType.L_BRACE) {
            const isIntelligent = DecoratorProcessor.matchAndDelete('BDOI', true);
            const parser: BDOParser<T, N> = this.parent.get(BDOParser) as BDOParser<T, N>;

            return parser.setMode(isIntelligent ? ODBMode.Intelligent : ODBMode.Simple).parse();
        }

        if (token.type === TokenType.L_PAREN) {
            this.consume(TokenType.L_PAREN);
            const node = this.parent.get(ExpressionParser).parse();
            this.consume(TokenType.R_PAREN);

            return this.createNode<ExpressionNode<T, N>>({
                type: TokenType.EXPRESION,
                object: node,
            });
        }

        if (token.value === TokenType.JS) {
            this.consume(TokenType.JS);
            this.consume(TokenType.L_PAREN);
            const content = this.consume(TokenType.TEXTO).value;
            this.consume(TokenType.R_PAREN);

            return this.createNode<JSNode<T>>({
                type: TokenType.JS,
                value: content
            });
        }

        if (([ TokenType.IDENTIFICADOR, TokenType.Esta, TokenType.Super ] as TokenType[]).includes(token.type)) {
            return this.parent.get(AccessParser).parse();
        }

        if (([ TokenType.NUMERO, TokenType.BIGINT, TokenType.TEXTO, TokenType.BOOLEANO, TokenType.Indefinido ] as TokenType[]).includes(token.type)) {
            return this.parent.get(LiteralParser).parse();
        }

        throw new ChordError(
            ErrorLevel.Parser,
            `Token inesperado en expresión: ${token.type} en la posición ${this.parent.cursor}`,
            token.location
        ).format();
    }
}