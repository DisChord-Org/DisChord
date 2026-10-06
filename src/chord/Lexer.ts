import { Token, TokenType } from './types';
import { ChordError, ErrorLevel } from '../errors/ChordError';
import { CompilationContext } from '../cli/commands/CompileCommand';
import { SymbolTranslationMap } from './Symbols';

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

    constructor(
        private context: CompilationContext
    ) {
        this.input = this.context.codeProvider.currentCode;
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
            }
        }
    }

    public tokenize(): Token<T>[] {
        const tokens: Token<T>[] = [];

        while (this.current < this.input.length) {
            const startLine = this.line;
            const startCol = this.column;
            let char = this.peek();

            if (/\s/.test(char)) { // Espacios en blanco
                this.advance();
                continue;
            }

            if (char === "/") {  // Comentarios
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
                    tokens.push(this.createToken(SymbolTranslationMap["/"], SymbolTranslationMap["/"], startLine, startCol));
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
                tokens.push(this.createToken("TEXTO", value, startLine, startCol));
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
                    tokens.push(this.createToken("BIGINT", value, startLine, startCol));
                } else {
                    tokens.push(this.createToken(TokenType.NUMERO, value, startLine, startCol));
                }
                continue;
            }

            // Decoradores
            if (char === '@') {
                let value = this.advance();

                while (this.current < this.input.length && Lexer.WORD_PART.test(this.peek())) {
                    value += this.advance();
                }

                tokens.push(this.createToken(TokenType.Decorador, value, startLine, startCol));
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
                    tokens.push(this.createToken(TokenType.IDENTIFICADOR, value, startLine, startCol));
                } else if (value === TokenType.Verdadero || value === TokenType.Falso) {
                    tokens.push(this.createToken(TokenType.BOOLEANO, value, startLine, startCol));
                } else if (value === TokenType.Indefinido) {
                    tokens.push(this.createToken(TokenType.Indefinido, value, startLine, startCol));
                } else if (value === TokenType.Espacio) {
                    tokens.push(this.createToken(TokenType.TEXTO, ' ', startLine, startCol));
                } else if (value === TokenType.Intro) {
                    tokens.push(this.createToken(TokenType.TEXTO, '\n', startLine, startCol));
                } else if (Lexer.ASCII_ONLY.test(value) && this.context.keywordsManager.isKeyword(value)) {
                    tokens.push(this.createToken(this.context.keywordsManager.resolve(value.toLowerCase()) as TokenType, value, startLine, startCol));
                } else {
                    tokens.push(this.createToken(TokenType.IDENTIFICADOR, value, startLine, startCol));
                }
                continue;
            }

            if (this.current < this.input.length - 1) {
                const nextChar = this.input[this.current + 1];
                const twoChar = char + nextChar;
                if (SymbolTranslationMap[twoChar]) {
                    this.advance();
                    this.advance();
                    tokens.push(this.createToken(SymbolTranslationMap[twoChar], twoChar, startLine, startCol));
                    continue;
                }
            }

            if (SymbolTranslationMap[char]) {
                this.advance();
                tokens.push(this.createToken(SymbolTranslationMap[char], char, startLine, startCol));
                continue;
            }

            throw new ChordError({
                phase: ErrorLevel.Lexer,
                message: `Carácter inesperado: ${char}`,
                location: {
                    line: this.line,
                    column: this.column
                }
            }).format();
        }

        return tokens;
    }
}
