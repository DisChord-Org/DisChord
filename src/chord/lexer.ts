import { Token } from './types';
import { symbols } from './symbols';
import { KeyWords } from './keywords';

export class Lexer {
    private line = 1;
    private column = 1;
    private current = 0;

    constructor(private input: string) {}

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

    private createToken (type: string, value: string, line: number, column: number): Token {
        return {
            type,
            value,
            location: {
                line,
                column
            }
        }
    }

    public tokenize(): Token[] {
        const tokens: Token[] = [];

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
                    tokens.push(this.createToken(symbols["/"], symbols["/"], startLine, startCol));
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

                if (char === "0" && /[bBoOxX]/.test(this.input[this.current + 1])) { // bin, oct, hex
                    value += this.advance();
                    value += this.advance();

                    while (/[0-9a-fA-F]/.test(char) && this.current < this.input.length) {
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

                if (char === "n") {
                    value += this.advance();
                    tokens.push(this.createToken("BIGINT", value, startLine, startCol));
                } else {
                    tokens.push(this.createToken("NUMERO", value, startLine, startCol));
                }
                continue;
            }

            // Decoradores
            if (char === '@') {
                let value = this.advance();

                while (this.current < this.input.length && /[a-zA-Z0-9_]/.test(char)) {
                    value += this.advance();
                }

                tokens.push(this.createToken("DECORADOR", value, startLine, startCol));
                continue;
            }

            if (/[a-zA-Z]/.test(char)) { // Keywords, identificadores, booleanos, undefined
                let value = "";
                while (/[a-zA-Z0-9_]/.test(this.peek()) && this.current < this.input.length) {
                    value += this.advance();
                }

                if (value === "verdadero" || value === "falso") {
                    tokens.push(this.createToken("BOOL", value, startLine, startCol));
                } else if (value === "indefinido") {
                    tokens.push(this.createToken("INDEFINIDO", value, startLine, startCol));
                } else if (KeyWords.getStatements().includes(value)) {
                    tokens.push(this.createToken(value.toUpperCase(), value, startLine, startCol));
                } else {
                    tokens.push(this.createToken("IDENTIFICADOR", value, startLine, startCol));
                }
                continue;
            }

            if (this.current < this.input.length - 1) {
                const twoChar = char + this.input[this.current + 1];
                if (symbols[twoChar]) {
                    this.advance();
                    this.advance();
                    tokens.push(this.createToken(symbols[twoChar], twoChar, startLine, startCol));
                    continue;
                }
            }

            if (symbols[char]) {
                this.advance();
                tokens.push(this.createToken(symbols[char], char, startLine, startCol));
                continue;
            }

            throw new Error(`Token inesperado: ${char}`);
        }

        return tokens;
    }
}
