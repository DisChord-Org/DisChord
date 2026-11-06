import { Location, NamedTextLiteral, Token, TokenType } from './model/types';
import { ChordError, ErrorLevel } from '../errors/ChordError';
import { CompilationContext } from './model/CompilationContext';
import { SymbolTranslationMap } from './model/Symbols';
import { interpolate } from './Interpolation';

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

    /**
     * Reserved words are plain ASCII. A word with any other character is never looked up among
     * them, since case folding could otherwise map one onto an ASCII keyword (`K`, the Kelvin
     * sign, lowercases to `k`).
     */
    private static readonly ASCII_ONLY = /^[\u0000-\u007F]*$/;

    /** A decimal digit. */
    private static readonly DIGIT = /[0-9]/;

    private line = 1;
    private column = 1;
    private current = 0;
    private input: string;

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
        this.input = source ?? this.context.codeProvider.currentCode;
    }

    private peek(): string {
        return this.input[this.current] || '';
    }

    private advance(): string {
        const char = this.input[this.current++];

        if (char === '\n') {
            this.line++;
            this.column = 1;
        } else {
            this.column++;
        }

        return char;
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
                line: this.line,
                column: this.column
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
        this.tokens = [];
        this.lineHasContent = false;
        this.blankLinePending = false;

        while (this.current < this.input.length) {
            const startLine = this.line;
            const startCol = this.column;
            const char = this.peek();

            if (/\s/.test(char)) {
                this.skipWhitespace(char);
            } else if (char === "/") {
                this.readSlash(startLine, startCol);
            } else if (char === '"') {
                this.readString(startLine, startCol);
            } else if (Lexer.DIGIT.test(char)) {
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

        this.advance();
    }

    /** A `/` starts a line comment, a block comment, or is the `entre` operator. */
    private readSlash(startLine: number, startCol: number): void {
        this.lineHasContent = true;
        this.advance(); // Consume el primer "/"
        const nextChar = this.peek();

        if (nextChar === "/") { // Comentario de línea
            this.advance();
            while (this.current < this.input.length && this.peek() !== "\n") this.advance();
        } else if (nextChar === "*") { // Comentario de bloque
            this.advance();
            while (this.current < this.input.length) {
                if (this.peek() === "*" && this.input[this.current + 1] === "/") {
                    this.advance();
                    this.advance();
                    break;
                }
                this.advance();
            }
        } else { // No es un comentario: "/" es el operador "ENTRE"
            this.emit(this.createToken(SymbolTranslationMap["/"], SymbolTranslationMap["/"], startLine, startCol));
        }
    }

    /** Reads a text; an interpolated one is rewritten to several tokens, except right after `desde` or `js(`. */
    private readString(startLine: number, startCol: number): void {
        this.advance();
        let value = "";
        while (this.current < this.input.length && this.peek() !== '"') {
            value += this.advance();
        }
        this.advance();

        const text = this.createToken("TEXTO", value, startLine, startCol);
        const previous = this.tokens[this.tokens.length - 1];
        const beforePrevious = this.tokens[this.tokens.length - 2];
        const raw = previous !== undefined && (previous.type === TokenType.Desde
            || (beforePrevious?.type === TokenType.JS && previous.type === TokenType.L_PAREN));

        (raw ? [ text ] : interpolate(text, code => new Lexer<T>(this.context, code).tokenize())).forEach(token => this.emit(token));
    }

    /** Reads a number: decimal, binary, octal or hexadecimal, and a BigInt when it ends in `n`. */
    private readNumber(startLine: number, startCol: number): void {
        let value = "";

        if (this.peek() === "0" && /[bBoOxX]/.test(this.input[this.current + 1])) { // bin, oct, hex
            value += this.advance();
            value += this.advance();

            while (/[0-9a-fA-F]/.test(this.peek()) && this.current < this.input.length) {
                value += this.advance();
            }
        } else {
            value = this.readDecimal();
        }

        if (this.peek() === "n") {
            value += this.advance();
            this.emit(this.createToken("BIGINT", value, startLine, startCol));
        } else {
            this.emit(this.createToken(TokenType.NUMERO, value, startLine, startCol));
        }
    }

    /** Reads digits with, at most, one decimal point that has a digit after it. */
    private readDecimal(): string {
        let value = "";

        while (this.current < this.input.length) {
            const next = this.peek();

            if (Lexer.DIGIT.test(next)) {
                value += this.advance();
            } else if (next === "." && Lexer.DIGIT.test(this.input[this.current + 1]) && !value.includes(".")) {
                value += this.advance();
            } else break;
        }

        return value;
    }

    private readDecorator(startLine: number, startCol: number): void {
        let value = this.advance();

        while (this.current < this.input.length && Lexer.WORD_PART.test(this.peek())) {
            value += this.advance();
        }

        this.emit(this.createToken(TokenType.Decorador, value, startLine, startCol));
    }

    /** Reads a keyword, an identifier, a boolean, `indefinido` or a named text. */
    private readWord(startLine: number, startCol: number): void {
        let value = "";
        while (Lexer.WORD_PART.test(this.peek()) && this.current < this.input.length) {
            value += this.advance();
        }

        // Composed and decomposed spellings of a letter (`ñ`) must be the same identifier.
        value = value.normalize('NFC');

        const { type, text } = this.classifyWord(value);

        this.emit(this.createToken(type, text, startLine, startCol));
    }

    /** The token type and text of a word. */
    private classifyWord(value: string): { type: TokenType; text: string } {
        const { keywordsManager } = this.context;

        // A word right after `.` is always a member name, even if it is a reserved word
        // (`lista.en(0)`, `fecha.entre`), so it never goes through the keyword lookup.
        if (this.tokens[this.tokens.length - 1]?.type === TokenType.Punto) return { type: TokenType.IDENTIFICADOR, text: value };
        if (value === TokenType.Verdadero || value === TokenType.Falso) return { type: TokenType.BOOLEANO, text: value };
        if (value === TokenType.Indefinido) return { type: TokenType.Indefinido, text: value };
        if (Object.prototype.hasOwnProperty.call(NamedTextLiteral, value)) {
            return { type: TokenType.TEXTO, text: NamedTextLiteral[value as keyof typeof NamedTextLiteral] };
        }

        const keyword = Lexer.ASCII_ONLY.test(value) ? keywordsManager.resolve(value) : undefined;

        if (keyword) return { type: keyword as TokenType, text: value };

        return { type: TokenType.IDENTIFICADOR, text: value };
    }

    /** Reads an operator or delimiter of one or two characters; anything else is a lexical error. */
    private readSymbol(char: string, startLine: number, startCol: number): void {
        if (this.current < this.input.length - 1) {
            const twoChar = char + this.input[this.current + 1];

            if (SymbolTranslationMap[twoChar]) {
                this.advance();
                this.advance();
                this.emit(this.createToken(SymbolTranslationMap[twoChar], twoChar, startLine, startCol));
                return;
            }
        }

        if (char === ';') {
            this.fail("No se usa ';': separa las propiedades y las sentencias con saltos de línea", { line: startLine, column: startCol });
        }

        if (SymbolTranslationMap[char]) {
            this.advance();
            this.emit(this.createToken(SymbolTranslationMap[char], char, startLine, startCol));
            return;
        }

        this.fail(`Carácter inesperado: ${char}`, { line: this.line, column: this.column });
    }
}
