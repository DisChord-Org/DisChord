import { Token } from "src/Types/Token";

export class Lexer {
    private keywords = require('./keywords');
    private symbols = require('./symbols');

    constructor(private input: string) {}

    public tokenize(): Token[] {
        const tokens: Token[] = [];
        let current = 0;

        while (current < this.input.length) {
            let char = this.input[current];

            if (/\s/.test(char)) { // Espacios en blanco
                current++;
                continue;
            }

            if (char === "/") {  // Comentarios
                const nextChar = this.input[current + 1]; 
            
                if (nextChar === "/") { // Comentario de línea
                    current += 2; // Consume "//"
                    while (current < this.input.length && this.input[current] !== "\n") {
                        current++;
                    }
                    continue;
                } else if (nextChar === "*") { // Comentario de bloque
                    current += 2; // Consume "/*"
                    while (current < this.input.length) {
                        if (this.input[current] === "*" && this.input[current + 1] === "/") {
                            current += 2; // Consume "*/"
                            break;
                        }
                        current++;
                    }
                    continue;
                } else {
                    // No es un comentario por lo que vamos a tratar "/" como operador "ENTRE"
                    tokens.push({ type: this.symbols["/"], value: this.symbols["/"] });
                    current++;
                    continue;
                }
            }

            if (char === '"') { // Strings
                let value = "";
                char = this.input[++current];
                while (char !== '"' && current < this.input.length) {
                    value += char;
                    char = this.input[++current];
                }
                current++;
                tokens.push({ type: "TEXTO", value });
                continue;
            }

            if (char === "[") { // Arrays
                let value = "[";
                char = this.input[++current];
                while (char !== "]" && current < this.input.length) {
                    value += char;
                    char = this.input[++current];
                }
                value += ']';
                current++;
                tokens.push({ type: "LISTA", value });
                continue;
            }

            if (/[0-9]/.test(char) || char === "0") { // Números y BigInt
                let value = "";

                if (char === "0" && /[bBoOxX]/.test(this.input[current + 1])) { // bin, oct, hex
                    value += char;
                    char = this.input[++current];
                    value += char;
                    char = this.input[++current];

                    while (/[0-9a-fA-F]/.test(char) && current < this.input.length) {
                        value += char;
                        char = this.input[++current];
                    }
                } else {
                    while ((/[0-9]/.test(char) || char === ".") && current < this.input.length) {
                        if (char === "." && value.includes(".")) { // Validar que no haya más de un punto decimal
                            throw new Error("Número inválido: múltiples puntos decimales.");
                        }
                        value += char;
                        char = this.input[++current];
                    }
                }

                if (char === "n") {
                    value += char;
                    char = this.input[++current];
                }

                // Asegurar de agregar todo como un único token si es BIGINT
                if (/^[0-9]+n$/.test(value) || /^0[bBoOxX][0-9a-fA-F]+n$/.test(value)) {
                    tokens.push({ type: "BIGINT", value });
                } else {
                    tokens.push({ type: "NUMERO", value });
                }

                continue;
            }

            if (/[a-zA-Z]/.test(char)) { // Keywords, identificadores, booleanos, undefined, null
                let value = "";
                while (/[a-zA-Z0-9_]/.test(char) && current < this.input.length) {
                    value += char;
                    char = this.input[++current];
                }

                if (this.keywords.includes(value)) {
                    tokens.push({ type: value.toUpperCase(), value });
                } else if (value === 'indefinido') {
                    tokens.push({ type: "INDEFINIDO", value });
                } else if (value === 'nulo') {
                    tokens.push({ type: "NULO", value });
                } else if (["verdadero", "falso" ].includes(value)) {
                    tokens.push({ type: "BOOL", value });
                } else if ([ "MAYOR", "MENOR", "MAYOR_IGUAL", "MENOR_IGUAL", "NO", "IGUAL_TIPADO", "IGUAL", "Y", "O" ].includes(value)) {
                    tokens.push({ type: "COMPARADOR", value });
                } else {
                    tokens.push({ type: value, value });
                }
                continue;
            }

            if (current < this.input.length - 1) {
                const twoChar = char + this.input[current + 1];
                if (this.symbols[twoChar]) {
                    tokens.push({ type: this.symbols[twoChar], value: twoChar });
                    current += 2;
                    continue;
                }
            }

            if (this.symbols[char]) {
                tokens.push({ type: this.symbols[char], value: char });
                current++;
                continue;
            }

            throw new Error(`Token inesperado: ${char}`);
        }

        return tokens;
    }
}
