import { Location, NamedTextLiteral, Token, TokenType } from './model/types';
import { ChordError, ErrorLevel } from '../errors/ChordError';
import { CompilationContext } from './model/CompilationContext';
import { SymbolTranslationMap } from './model/Symbols';

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

    private line = 1;
    private column = 1;
    private current = 0;
    private input: string;

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

    /**
     * Where the character at `offset` of a text's content is in the file: the content starts right
     * after the opening quote, and a new line inside the text starts a new line of the file.
     * @private
     */
    private locate (text: Token<T>, offset: number): Location {
        const before = text.value.slice(0, offset).split('\n');

        return before.length === 1
            ? { line: text.location.line, column: text.location.column + 1 + offset }
            : { line: text.location.line + before.length - 1, column: before[before.length - 1].length + 1 };
    }

    /**
     * Rewrites an interpolated text (`"hola {n}!"`) to the tokens of `("hola " mas (n) mas "!")`.
     * Each fragment of text spans exactly what it was read from, and what the rewrite invents (the
     * parentheses, `mas`, and an empty text that opens the whole) is marked `synthetic` and has no
     * width: the `(` and `mas` of an expression sit at its `{`, its `)` at its `}`, the outer
     * parentheses at the start and at the end of the literal.
     * @private
     */
    private interpolate (text: Token<T>): Token<T>[] {
        const value = text.value;
        const parts: ({ text: string; from: number; to: number } | { code: string; offset: number; open: number; close: number })[] = [];
        let buffer = '';
        let bufferStart = 0;
        let found = false;
        let index = 0;

        while (index < value.length) {
            const char = value[index];

            if ((char === '{' || char === '}') && value[index + 1] === char) {
                buffer += char;
                index += 2;
                continue;
            }

            if (char === '{') {
                const close = value.indexOf('}', index + 1);
                const code = close === -1 ? '' : value.slice(index + 1, close);

                if (close !== -1 && /^\s*[\p{L}_]/u.test(code) && !code.includes('{')) {
                    parts.push({ text: buffer, from: bufferStart, to: index }, { code, offset: index + 1, open: index, close });
                    buffer = '';
                    found = true;
                    index = close + 1;
                    bufferStart = index;
                    continue;
                }
            }

            buffer += char;
            index++;
        }

        if (!found) return [ buffer === value ? text : { ...text, value: buffer } ];

        parts.push({ text: buffer, from: bufferStart, to: value.length });

        const synthetic = (type: TokenType, tokenValue: string, at: Location): Token<T> => ({ type, value: tokenValue, location: at, end: at, synthetic: true } as Token<T>);
        const fragment = (content: string, from: number, to: number): Token<T> => ({ ...text, value: content, location: this.locate(text, from), end: this.locate(text, to) });
        const start = this.locate(text, 0);
        const result: Token<T>[] = [ synthetic(TokenType.L_PAREN, '(', text.location) ];
        let first = true;

        for (const part of parts) {
            if ('code' in part) {
                const open = this.locate(text, part.open);
                const close = this.locate(text, part.close);

                // the text always comes first, so the whole is a text however the expression is
                if (first) result.push({ ...synthetic(TokenType.TEXTO, '', start) });

                result.push(synthetic(TokenType.Mas, 'mas', open), synthetic(TokenType.L_PAREN, '(', open));
                result.push(...this.tokenizeInside(text, part.code, part.offset));
                result.push(synthetic(TokenType.R_PAREN, ')', close));
                first = false;
                continue;
            }

            if (part.text === '' && !first) continue;
            if (part.text === '' && first && parts.length > 1) continue;

            if (!first) result.push(synthetic(TokenType.Mas, 'mas', this.locate(text, part.from)));
            result.push(fragment(part.text, part.from, part.to));
            first = false;
        }

        result.push(synthetic(TokenType.R_PAREN, ')', text.end));

        return result;
    }

    /**
     * Tokenizes the expression written inside the braces of an interpolated text, with its tokens
     * placed where they are in the file so an error points into the text.
     * @private
     */
    private tokenizeInside (text: Token<T>, code: string, offset: number): Token<T>[] {
        const inner = new Lexer<T>(this.context, code).tokenize();

        // where each character of the text is in the file: the text starts right after its quote
        const before = text.value.slice(0, offset).split('\n');
        const line = text.location.line + before.length - 1;
        const column = before.length === 1 ? text.location.column + 1 + offset : before[before.length - 1].length + 1;

        const place = (at: Location): Location => at.line === 1
            ? { line, column: column + at.column - 1 }
            : { line: line + at.line - 1, column: at.column };

        return inner.map(token => ({ ...token, location: place(token.location), end: place(token.end) }));
    }

    public tokenize(): Token<T>[] {
        const tokens: Token<T>[] = [];

        // an empty line is one with nothing on it: no token and no comment
        let lineHasContent = false;
        let blankLinePending = false;

        const emit = (token: Token<T>): void => {
            if (blankLinePending) token.blankLineBefore = true;
            blankLinePending = false;
            lineHasContent = true;
            tokens.push(token);
        };

        while (this.current < this.input.length) {
            const startLine = this.line;
            const startCol = this.column;
            let char = this.peek();

            if (/\s/.test(char)) { // Espacios en blanco
                if (char === '\n') {
                    if (!lineHasContent) blankLinePending = true;
                    lineHasContent = false;
                }

                this.advance();
                continue;
            }

            if (char === "/") {  // Comentarios
                lineHasContent = true;
                this.advance();
                const nextChar = this.peek(); // Consume el primer "/"
            
                if (nextChar === "/") { // Comentario de línea
                    this.advance(); // Consume el segundo "/"
                    while (this.current < this.input.length && this.peek() !== "\n") {
                        this.advance();
                    }
                    continue;
                } else if (nextChar === "*") { // Comentario de bloque
                    this.advance(); // Consume "*"
                    while (this.current < this.input.length) {
                        if (this.peek() === "*" && this.input[this.current + 1] === "/") {
                            this.advance(); // Consume "*"
                            this.advance(); // Consume "/"
                            break;
                        }
                        this.advance();
                    }
                    continue;
                } else {
                    // No es un comentario por lo que vamos a tratar "/" como operador "ENTRE"
                    emit(this.createToken(SymbolTranslationMap["/"], SymbolTranslationMap["/"], startLine, startCol));
                    continue;
                }
            }

            if (char === '"') { // Strings
                this.advance();
                let value = "";
                while (this.current < this.input.length && this.peek() !== '"') {
                    value += this.advance();
                }
                this.advance();

                const text = this.createToken("TEXTO", value, startLine, startCol);
                const raw = tokens.length >= 1 && (tokens[tokens.length - 1].type === TokenType.Desde
                    || (tokens.length >= 2 && tokens[tokens.length - 2].type === TokenType.JS && tokens[tokens.length - 1].type === TokenType.L_PAREN));

                (raw ? [ text ] : this.interpolate(text)).forEach(emit);
                continue;
            }

            if (/[0-9]/.test(char) || char === "0") { // Números y BigInt
                let value = "";

                if (this.peek() === "0" && /[bBoOxX]/.test(this.input[this.current + 1])) { // bin, oct, hex
                    value += this.advance();
                    value += this.advance();

                    while (/[0-9a-fA-F]/.test(this.peek()) && this.current < this.input.length) {
                        value += this.advance();
                    }
                } else {
                    while (this.current < this.input.length) {
                        const next = this.peek();
                        
                        if (/[0-9]/.test(next)) {
                            value += this.advance();
                        } else if (next === ".") {
                            const nextChar = this.input[this.current + 1];
                            if (/[0-9]/.test(nextChar) && !value.includes(".")) {
                                value += this.advance();
                            } else break; 
                        } else break;
                    }
                }

                if (this.peek() === "n") {
                    value += this.advance();
                    emit(this.createToken("BIGINT", value, startLine, startCol));
                } else {
                    emit(this.createToken(TokenType.NUMERO, value, startLine, startCol));
                }
                continue;
            }

            // Decoradores
            if (char === '@') {
                let value = this.advance();

                while (this.current < this.input.length && Lexer.WORD_PART.test(this.peek())) {
                    value += this.advance();
                }

                emit(this.createToken(TokenType.Decorador, value, startLine, startCol));
                continue;
            }

            if (Lexer.WORD_START.test(char)) { // Keywords, identificadores, booleanos, undefined
                let value = "";
                while (Lexer.WORD_PART.test(this.peek()) && this.current < this.input.length) {
                    value += this.advance();
                }

                // Composed and decomposed spellings of a letter (`ñ`) must be the same identifier.
                value = value.normalize('NFC');

                // A word right after `.` is always a member name, even if it is a reserved word
                // (`lista.en(0)`, `fecha.entre`), so it never goes through the keyword lookup.
                if (tokens[tokens.length - 1]?.type === TokenType.Punto) {
                    emit(this.createToken(TokenType.IDENTIFICADOR, value, startLine, startCol));
                } else if (value === TokenType.Verdadero || value === TokenType.Falso) {
                    emit(this.createToken(TokenType.BOOLEANO, value, startLine, startCol));
                } else if (value === TokenType.Indefinido) {
                    emit(this.createToken(TokenType.Indefinido, value, startLine, startCol));
                } else if (Object.prototype.hasOwnProperty.call(NamedTextLiteral, value)) {
                    emit(this.createToken(TokenType.TEXTO, NamedTextLiteral[value as keyof typeof NamedTextLiteral], startLine, startCol));
                } else if (Lexer.ASCII_ONLY.test(value) && this.context.keywordsManager.isKeyword(value)) {
                    emit(this.createToken(this.context.keywordsManager.resolve(value.toLowerCase()) as TokenType, value, startLine, startCol));
                } else {
                    emit(this.createToken(TokenType.IDENTIFICADOR, value, startLine, startCol));
                }
                continue;
            }

            if (this.current < this.input.length - 1) {
                const nextChar = this.input[this.current + 1];
                const twoChar = char + nextChar;
                if (SymbolTranslationMap[twoChar]) {
                    this.advance();
                    this.advance();
                    emit(this.createToken(SymbolTranslationMap[twoChar], twoChar, startLine, startCol));
                    continue;
                }
            }

            if (SymbolTranslationMap[char]) {
                this.advance();
                emit(this.createToken(SymbolTranslationMap[char], char, startLine, startCol));
                continue;
            }

            throw new ChordError({
                phase: ErrorLevel.Lexer,
                message: `Carácter inesperado: ${char}`,
                location: {
                    line: this.line,
                    column: this.column
                }
            });
        }

        return tokens;
    }
}
