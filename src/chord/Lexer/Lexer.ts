import { Location, Token, TokenType } from '../model/types';
import { ChordError, ErrorLevel } from '../../errors/ChordError';
import { CompilationContext } from '../model/CompilationContext';
import { SymbolTranslationMap } from '../model/Symbols';
import { InterpolatedText } from './InterpolatedText';
import { SourceCursor } from './SourceCursor';
import { NumberReader } from './NumberReader';
import { WordClassifier } from './WordClassifier';

export class Lexer<T extends string> {
    /**
     * First character of a word: any Unicode letter (`año`, `canción`, `ñu`).
     */
    private static readonly WORD_START = /\p{L}/u;

    /**
     * Rest of a word: letters, combining marks (so `ñ` written as `n` + U+0303 lexes as one
     * word), ASCII digits and `_`. Digits of other scripts and symbols are left out on purpose.
     */
    private static readonly WORD_PART = /[\p{L}\p{M}0-9_]/u;

    private readonly cursor: SourceCursor;
    private readonly words: WordClassifier;

    /** The tokens read so far. */
    private tokens: Token<T>[] = [];

    // an empty line is one with nothing on it: no token and no comment
    private lineHasContent = false;
    private blankLinePending = false;

    /**
     * @param context - The compilation context.
     * @param source - The text to tokenize, when it is not the file being compiled: the expression
     * written between the braces of an interpolated text.
     */
    constructor(
        private context: CompilationContext,
        source?: string
    ) {
        this.cursor = new SourceCursor(source ?? this.context.codeProvider.currentCode);
        this.words = new WordClassifier(this.context.keywordsManager);
    }

    private createToken (type: TokenType, value: string, line: number, column: number): Token<T> {
        return {
            type,
            value,
            location: {
                line,
                column
            },
            end: {
                line: this.cursor.line,
                column: this.cursor.column
            }
        }
    }

    /** Throws a lexical error at `location`. */
    private fail(message: string, location: Location): never {
        throw new ChordError({ phase: ErrorLevel.Lexer, message, location });
    }

    /** Adds a token to the output, carrying the blank line that precedes it, if any. */
    private emit(token: Token<T>): void {
        if (this.blankLinePending) token.blankLineBefore = true;
        this.blankLinePending = false;
        this.lineHasContent = true;
        this.tokens.push(token);
    }

    public tokenize(): Token<T>[] {
        const { cursor } = this;

        this.tokens = [];
        this.lineHasContent = false;
        this.blankLinePending = false;

        while (!cursor.atEnd) {
            const startLine = cursor.line;
            const startCol = cursor.column;
            const char = cursor.peek();

            if (/\s/.test(char)) {
                this.skipWhitespace(char);
            } else if (char === "/") {
                this.readSlash(startLine, startCol);
            } else if (char === '"') {
                this.readString(startLine, startCol);
            } else if (NumberReader.isDigit(char)) {
                this.readNumber(startLine, startCol);
            } else if (char === '@') {
                this.readDecorator(startLine, startCol);
            } else if (Lexer.WORD_START.test(char)) {
                this.readWord(startLine, startCol);
            } else {
                this.readSymbol(char, startLine, startCol);
            }
        }

        return this.tokens;
    }

    /** Consumes one whitespace character; a line break on a line with nothing on it makes a blank line. */
    private skipWhitespace(char: string): void {
        if (char === '\n') {
            if (!this.lineHasContent) this.blankLinePending = true;
            this.lineHasContent = false;
        }

        this.cursor.advance();
    }

    /** A `/` starts a line comment, a block comment, or is the `entre` operator. */
    private readSlash(startLine: number, startCol: number): void {
        const { cursor } = this;

        this.lineHasContent = true;
        cursor.advance(); // Consume el primer "/"
        const nextChar = cursor.peek();

        if (nextChar === "/") { // Comentario de línea
            cursor.advance();
            cursor.readWhile(char => char !== "\n");
        } else if (nextChar === "*") { // Comentario de bloque
            cursor.advance();
            while (!(cursor.peek() === "*" && cursor.peekAt(1) === "/")) {
                if (cursor.atEnd) this.fail("Comentario sin cerrar: falta '*/'", { line: startLine, column: startCol });
                cursor.advance();
            }
            cursor.advance();
            cursor.advance();
        } else { // No es un comentario: "/" es el operador "ENTRE"
            this.emit(this.createToken(SymbolTranslationMap["/"], SymbolTranslationMap["/"], startLine, startCol));
        }
    }

    /** Reads a text; an interpolated one is rewritten to several tokens, except right after `desde` or `js(`. */
    private readString(startLine: number, startCol: number): void {
        const { cursor } = this;

        cursor.advance();
        const value = cursor.readWhile(char => char !== '"');
        if (cursor.atEnd) this.fail("Texto sin cerrar: falta la comilla '\"' de cierre", { line: startLine, column: startCol });
        cursor.advance();

        const text = this.createToken("TEXTO", value, startLine, startCol);
        const previous = this.tokens[this.tokens.length - 1];
        const beforePrevious = this.tokens[this.tokens.length - 2];
        const raw = previous !== undefined && (previous.type === TokenType.Desde
            || (beforePrevious?.type === TokenType.JS && previous.type === TokenType.L_PAREN));

        (raw ? [ text ] : new InterpolatedText(text, code => new Lexer<T>(this.context, code).tokenize()).toTokens()).forEach(token => this.emit(token));
    }

    /** Reads a number: decimal, binary, octal or hexadecimal, and a BigInt when it ends in `n`. */
    private readNumber(startLine: number, startCol: number): void {
        const { value, bigint } = NumberReader.read(this.cursor);

        this.emit(this.createToken(bigint ? "BIGINT" : TokenType.NUMERO, value, startLine, startCol));
    }

    private readDecorator(startLine: number, startCol: number): void {
        const value = this.cursor.advance() + this.cursor.readWhile(char => Lexer.WORD_PART.test(char));

        this.emit(this.createToken(TokenType.Decorador, value, startLine, startCol));
    }

    /** Reads a keyword, an identifier, a boolean, `indefinido` or a named text. */
    private readWord(startLine: number, startCol: number): void {
        // Composed and decomposed spellings of a letter (`ñ`) must be the same identifier.
        const value = this.cursor.readWhile(char => Lexer.WORD_PART.test(char)).normalize('NFC');

        const { type, text } = this.words.classify(value, this.tokens[this.tokens.length - 1]);

        this.emit(this.createToken(type, text, startLine, startCol));
    }

    /** Reads an operator or delimiter of one or two characters; anything else is a lexical error. */
    private readSymbol(char: string, startLine: number, startCol: number): void {
        const { cursor } = this;
        const next = cursor.peekAt(1);

        if (next !== undefined) {
            const twoChar = char + next;

            if (SymbolTranslationMap[twoChar]) {
                cursor.advance();
                cursor.advance();
                this.emit(this.createToken(SymbolTranslationMap[twoChar], twoChar, startLine, startCol));
                return;
            }
        }

        if (char === ';') {
            this.fail("No se usa ';': separa las propiedades y las sentencias con saltos de línea", { line: startLine, column: startCol });
        }

        if (SymbolTranslationMap[char]) {
            cursor.advance();
            this.emit(this.createToken(SymbolTranslationMap[char], char, startLine, startCol));
            return;
        }

        this.fail(`Carácter inesperado: ${char}`, { line: cursor.line, column: cursor.column });
    }
}
