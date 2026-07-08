import { Token, TokenType } from './types';
import { ChordError, ErrorLevel } from '../ChordError';
import { CompilationContext } from '../init/Init';
import { SymbolTranslationMap } from './Symbols';

export class Lexer<T extends string> {
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

                while (this.current < this.input.length && /[a-zA-Z0-9_]/.test(this.peek())) {
                    value += this.advance();
                }

                tokens.push(this.createToken(TokenType.Decorador, value, startLine, startCol));
                continue;
            }

            if (/[a-zA-Z]/.test(char)) { // Keywords, identificadores, booleanos, undefined
                let value = "";
                while (/[a-zA-Z0-9_]/.test(this.peek()) && this.current < this.input.length) {
                    value += this.advance();
                }

                if (value === TokenType.Verdadero || value === TokenType.Falso) {
                    tokens.push(this.createToken(TokenType.BOOLEANO, value, startLine, startCol));
                } else if (value === TokenType.Indefinido) {
                    tokens.push(this.createToken(TokenType.Indefinido, value, startLine, startCol));
                } else if (value === TokenType.Espacio) {
                    tokens.push(this.createToken(TokenType.TEXTO, ' ', startLine, startCol));
                } else if (value === TokenType.Intro) {
                    tokens.push(this.createToken(TokenType.TEXTO, '\n', startLine, startCol));
                } else if (this.context.keywordsManager.isKeyword(value)) {
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
