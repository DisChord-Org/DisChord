import { SubParser } from "../../SubParser";
import { ASTNode, BaseNode, ExpressionNode, IdentificatorNode, JSNode, ListNode, isLiteralToken, NewNode, ODBMode, SuperNode, ThisNode, TokenType, TokenTypeUnion } from "../../../model/types";
import { ExpressionParser } from "../Expressions/ExpressionParser";
import { AssignmentParser } from "../Expressions/AssignmentParser";
import { DecoratorProcessor } from "../../../DecoratorProcessor";
import { ChordError, ErrorLevel } from "../../../../errors/ChordError";
import { BDOParser } from "../BDOParser";
import { LiteralParser } from "../Expressions/LiteralParser";
import { AccessParser } from "../Expressions/AccessParser";

export class PrimaryParser<T extends string, N extends BaseNode<T>> extends SubParser<T, N> {
    /** To identify when this parser should be used */
    static triggerToken: TokenType | undefined;

    /**
     * Collection of reserved keywords this specific sub-parser registers
     */
    static keywords: TokenTypeUnion<string>[] = [ TokenType.Nuevo, TokenType.JS, TokenType.Esta, TokenType.Super ];

    public parse(): ASTNode<T, N> {
        const token = this.peek();

        if (token.type === TokenType.Nuevo) return this.parseNew();

        const customStatement = this.parent.parseCustomStatement();
        if (customStatement) return customStatement;

        if (token.type === TokenType.L_SQUARE) return this.parseList();
        if (token.type === TokenType.L_BRACE) return this.parseObject();
        if (token.type === TokenType.L_PAREN) return this.parseGroup();
        // unlike the others, `js` is recognised by the token's text, not by its type
        if (token.value === TokenType.JS) return this.parseJs();
        if (token.type === TokenType.Esta) return this.parseWord<ThisNode<T>>(TokenType.Esta);
        if (token.type === TokenType.Super) return this.parseWord<SuperNode<T>>(TokenType.Super);
        if (token.type === TokenType.IDENTIFICADOR) return this.parseIdentifier();
        if (isLiteralToken(token.type)) return this.parent.get(LiteralParser).parse();

        throw new ChordError({
            phase: ErrorLevel.Parser,
            message: token.type === TokenType.EOF
                ? 'Token inesperado: el archivo termina donde se esperaba un valor (un número, un texto, un nombre...)'
                : `Token inesperado: se esperaba un valor (un número, un texto, un nombre...) y se encontró '${token.value}'`,
            location: token.location
        });
    }

    /** `nuevo`: a dialect's statement, the class shorthand, or an instantiation. */
    private parseNew(): ASTNode<T, N> {
        this.consume(TokenType.Nuevo);

        const customStatement = this.parent.parseCustomStatement();
        if (customStatement) return customStatement;

        const classShorthand = this.parent.tryParseClassShorthand();
        if (classShorthand) return classShorthand;

        const call = this.parent.get(AccessParser).parse();
        return this.createNode<NewNode<T, N>>({
            type: TokenType.Nuevo,
            object: call
        });
    }

    /** `[ a, b ]` */
    private parseList(): ListNode<T, N> {
        this.consume(TokenType.L_SQUARE);
        const elements: ASTNode<T, N>[] = [];
        this.parseDelimited(TokenType.R_SQUARE, () => elements.push(this.parent.get(AssignmentParser).parse()));
        this.consume(TokenType.R_SQUARE);
        return this.createNode<ListNode<T, N>>({
            type: TokenType.LISTA,
            body: elements
        });
    }

    /** `{ ... }`: an object, simple or intelligent when a `@BDOI` decorator precedes it. */
    private parseObject(): ASTNode<T, N> {
        const isIntelligent = DecoratorProcessor.matchAndDelete('BDOI', true);
        const parser: BDOParser<T, N> = this.parent.get(BDOParser) as BDOParser<T, N>;

        return parser.setMode(isIntelligent ? ODBMode.Intelligent : ODBMode.Simple).parse();
    }

    /** `( expr )`; the parentheses an interpolated text is rewritten to are marked. */
    private parseGroup(): ExpressionNode<T, N> {
        const open = this.consume(TokenType.L_PAREN);
        const node = this.parent.get(ExpressionParser).parse();
        this.consume(TokenType.R_PAREN);

        return this.createNode<ExpressionNode<T, N>>({
            type: TokenType.EXPRESION,
            ...(open.synthetic ? { interpolated: true as const } : {}),
            object: node,
        });
    }

    /** `js("code")` */
    private parseJs(): JSNode<T> {
        this.consume(TokenType.JS);
        this.consume(TokenType.L_PAREN);
        const content = this.consume(TokenType.TEXTO).value;
        this.consume(TokenType.R_PAREN);

        return this.createNode<JSNode<T>>({
            type: TokenType.JS,
            value: content
        });
    }

    /** `esta` or `super`: a word that is a node by itself. */
    private parseWord<W extends ThisNode<T> | SuperNode<T>>(word: typeof TokenType.Esta | typeof TokenType.Super): W {
        this.consume(word);
        return this.createNode<W>({
            type: word,
            value: ''
        } as Omit<W, 'location'>);
    }

    private parseIdentifier(): IdentificatorNode<T> {
        const node = this.consume(TokenType.IDENTIFICADOR);
        return this.createNode<IdentificatorNode<T>>({
            type: TokenType.IDENTIFICADOR,
            value: node.value
        });
    }
}
