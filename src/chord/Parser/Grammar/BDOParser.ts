import { ChordError, ErrorLevel } from "../../../errors/ChordError";
import { ASTNode, BaseNode, BinaryOperators, LiteralTokens, ODBMode, ODBNode, TokenType, TokenTypeUnion } from "../../types";
import { Parser } from "../Parser";
import { SubParser } from "../SubParser";
import { ExpressionParser } from "./Expressions/ExpressionParser";

/**
 * Specialized SubParser for Object Data Blocks (BDO).
 */
export class BDOParser<T extends string, N extends BaseNode<T>> extends SubParser<T, N> {
    /** To identify when this parser should be used */
    static triggerToken: TokenType | undefined = TokenType.L_BRACE;

    /**
     * Collection of reserved keywords this specific sub-parser registers
     */
    static keywords: TokenTypeUnion<string>[] = [];

    /**
     * Stores the mode for the next parsing operation. 
     * Defaults to Simple but can be upgraded to Intelligent via decorators.
     */
    private nextMode: ODBMode = ODBMode.Simple;

    /**
     * @param parent - Reference to the main Parser orchestrator.
     */
    constructor (protected parent: Parser<T, N>) {
        super(parent);
    }

    /**
     * Configures the behavior mode for the upcoming ODB parsing.
     * @param mode - The ODBMode to apply (Simple or Intelligent).
     * @returns The current instance for method chaining.
     */
    public setMode (mode: ODBMode): this {
        this.nextMode = mode;
        return this;
    }

    /**
     * Entry point for the SubParser.
     * Consumes the BDO, generates the node, and resets the configuration mode.
     */
    public parse(): ASTNode<T, N> {
        const node = this.parseODB(this.nextMode);
        this.nextMode = ODBMode.Simple;
        return node;
    }

    /**
     * Main ODB parsing logic. A block has up to two parts: its **properties**, one `clave valor`
     * after another with no separator, and its **code**, which starts at the first entry that is
     * code and runs to the closing brace. A block with code is an intelligent one
     * (`ODBMode.Intelligent`).
     *
     * What is code is decided by the shape of the entry (`looksLikeProperty`), and once properties
     * exist an empty line must come before the first piece of code. An empty line followed by
     * another property does not start the code: properties may be grouped. A word is a property
     * key whatever it is (`si`, `clase`, `tipo`...), so a reserved word can name one.
     *
     * An optional `;` after a property is accepted and ignored.
     * @param mode - Mode requested by the caller; a block with code is intelligent whatever it was.
     * @returns A constructed ODBNode containing properties (blocks) and logic (body).
     * @throws {ChordError} If code follows the properties without an empty line in between.
     */
    private parseODB(mode: ODBMode = ODBMode.Simple): ODBNode<T, N> {
        this.consume(TokenType.L_BRACE);

        const blocks: Record<string, ASTNode<T, N>> = {};
        const body: ASTNode<T, N>[] = [];
        let inProperties = true;

        while (this.peek().type !== TokenType.R_BRACE) {
            if (this.peek().type === TokenType.EOF) {
                throw new ChordError({
                    phase: ErrorLevel.Parser,
                    message: "Falta '}' para cerrar el bloque",
                    location: this.peek().location
                });
            }

            if (inProperties) {
                if (this.looksLikeProperty()) {
                    this.parseProperty(blocks);
                    continue;
                }

                const token = this.peek();

                if (Object.keys(blocks).length > 0 && !token.blankLineBefore) throw new ChordError({
                    phase: ErrorLevel.Parser,
                    message: 'Separa el código de las propiedades con una línea en blanco',
                    location: token.location
                });

                inProperties = false;
            }

            const statement = this.parent.parseStatement();
            if (statement) body.push(statement);
        }

        this.consume(TokenType.R_BRACE);

        return this.createNode<ODBNode<T, N>>({
            type: TokenType.BDO,
            mode: mode === ODBMode.Intelligent || body.length > 0 ? ODBMode.Intelligent : ODBMode.Simple,
            blocks,
            body
        });
    }

    /**
     * Parses one `clave valor` property into `blocks`.
     * @throws {ChordError} If the block already has a property with that key.
     * @private
     */
    private parseProperty (blocks: Record<string, ASTNode<T, N>>): void {
        const keyToken = this.consume(this.peek().type);
        const key = keyToken.value;

        if (Object.prototype.hasOwnProperty.call(blocks, key)) throw new ChordError({
            phase: ErrorLevel.Parser,
            message: `La propiedad '${key}' está repetida en el bloque`,
            location: keyToken.location
        });

        blocks[key] = this.parent.get(ExpressionParser).parse();

        if (this.peek().type === TokenType.SEPARADOR) this.consume(TokenType.SEPARADOR);
    }

    /**
     * Whether the entry about to be read is a property: a word followed by what can only be its
     * value. It is code instead when the word is followed by what continues an expression or a
     * statement (`consola.imprimir`, `f(x)`, `x es 1`, `lista[0]`, `a mas b`), when it is the
     * start of a statement of the dialect (`enviar mensaje {`), when nothing
     * follows it, or when it starts a statement (`var`, `si`, `funcion`...) and what follows is
     * not a plain value (`si 1` is a property, `si (x)` is not).
     * @private
     */
    private looksLikeProperty (): boolean {
        const word = this.peek();
        const next = this.peek('next');

        if (!this.isWord(word)) return false;
        if (next.type === TokenType.R_BRACE || next.type === TokenType.EOF) return false;
        if (next.type === TokenType.Punto || next.type === TokenType.Es) return false;
        if ((BinaryOperators as string[]).includes(next.type)) return false;

        if (this.isWord(next) && this.peek(this.parent.cursor + 2).type === TokenType.L_BRACE) return false;

        const touching = next.location.line === word.end.line && next.location.column === word.end.column;
        if (touching && (next.type === TokenType.L_PAREN || next.type === TokenType.L_SQUARE)) return false;

        if (this.startsStatement(word.type)) return this.isPlainValue(next.type);

        return true;
    }

    /**
     * Whether a token of this type begins a statement: one a sub-parser is triggered by (`var`,
     * `si`, `para`...), or one `StatementParser` handles by context (`funcion`, `prop`, a decorator)
     * or `PrimaryParser` does (`nuevo`).
     * @private
     */
    private startsStatement (type: string): boolean {
        const byContext: string[] = [ TokenType.Funcion, TokenType.Prop, TokenType.Decorador, TokenType.Nuevo ];

        return byContext.includes(type) || this.parent.getChordSubParserByToken(type as TokenTypeUnion<T>) !== undefined;
    }

    /**
     * Whether a token of this type is a plain value (a literal, a list or a block), the only
     * thing that makes a statement keyword a property key (`si 1`).
     * @private
     */
    private isPlainValue (type: string): boolean {
        return (LiteralTokens as string[]).includes(type) || type === TokenType.L_SQUARE || type === TokenType.L_BRACE;
    }

    /**
     * Whether a token is a word: a letter-initial name, reserved or not, and not a literal.
     * @private
     */
    private isWord (token: { type: string; value: string }): boolean {
        return !(LiteralTokens as string[]).includes(token.type) && /^\p{L}/u.test(token.value);
    }
}
