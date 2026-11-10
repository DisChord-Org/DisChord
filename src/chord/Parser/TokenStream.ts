import { SUGGESTIONS } from "./ParserErrorSuggestions";
import { PeekType, Token, TokenType } from "../model/types";
import { ChordError, ErrorLevel } from "../../errors/ChordError";

/**
 * The token stream a parser reads: the tokens, the cursor over them, lookahead and the consumption
 * of the ones the grammar expects, with the diagnostic for the ones it does not.
 * @template {string} T - The token type union constraint, extending string.
 */
export class TokenStream<T extends string> {
    constructor(
        private tokens: Token<T>[],
        private current: number = 0
    ) {}

    /**
     * Inserts a token into the stream ahead of the cursor. A sub-parser uses it to close, with a
     * separator, an entry the grammar would otherwise run on into the next one.
     * @param {number} index - Where the token goes; has to be past the cursor.
     * @param {Token<T>} token - The token to insert.
     */
    public insertToken (index: number, token: Token<T>): void {
        if (index <= this.current) throw new Error('A token can only be inserted ahead of the cursor');

        this.tokens.splice(index, 0, token);
    }

    /**
     * Gets the current stream iteration cursor index.
     *
     */
    public get cursor (): number {
        return this.current;
    }

    /**
     * Performs an observation lookahead on the token stream relative to the cursor position without consuming tokens.
     *
     * @param {PeekType} [type='this'] - The offset instruction ('this', 'next', 'prev' or raw index integer).
     * @returns {Token<T>} The inspected token at the target relative position.
     */
    public peek(type: PeekType = 'this'): Token<T> {
        if (typeof type == 'number') return this.tokens[type];

        let targetIndex = this.cursor;

        if (type === 'next') targetIndex = this.cursor + 1;
        if (type === 'prev') targetIndex = this.cursor - 1;

        if (targetIndex < 0) return this.sentinel(TokenType.SOF, { line: 1, column: 1 }, { line: 1, column: 1 });

        if (targetIndex >= this.tokens.length) {
            const last = this.tokens[this.tokens.length - 1];

            return this.sentinel(TokenType.EOF, last?.location || { line: 1, column: 1 }, last?.end || { line: 1, column: 1 });
        }

        return this.tokens[targetIndex];
    }

    /** The start-of-file or end-of-file token, which is not in the source and is not in `tokens`. */
    private sentinel(type: typeof TokenType.SOF | typeof TokenType.EOF, location: Token<T>['location'], end: Token<T>['end']): Token<T> {
        return { type, value: '', location, end } as Token<T>;
    }

    /**
     * Verifies if the parsing iteration has reached the end of the token stream or hit EOF.
     *
     * @returns {boolean} True if no further tokens are available to parse.
     */
    public isAtEnd (): boolean {
        return this.peek().type === TokenType.EOF;
    }

    /**
     * @method match
     * @description Checks if the current token matches any of the provided types.
     * If it matches, it consumes the token and returns true.
     * @param {string | string[]} types - The token type(s) to check against.
     * @returns {boolean} True if the token was matched and consumed.
     */
    public match(types: string | string[]): boolean {
        const expected = Array.isArray(types) ? types : [types];
        const currentToken = this.peek();

        if (expected.includes(currentToken.type)) {
            this.consume(currentToken.type);
            return true;
        }

        return false;
    }

    /**
     * Guarantees the presence of a specific token type next in the stream. Consumes it if valid.
     * Throws a formatted diagnostic error containing localized user-friendly hints if validation fails.
     *
     * @param {string | string[]} expectedTypes - Token types expected to be at the cursor.
     * @param {string} [message] - Optional override message for the parsing mismatch.
     * @throws {ChordError} If the current token does not match any of the expected types.
     * @returns {Token<T>} The matched and consumed token.
     */
    public consume(expectedTypes: string | string[], message?: string): Token<T> {
        const token = this.peek();
        const expected = Array.isArray(expectedTypes) ? expectedTypes : [expectedTypes];

        if (expected.includes(token.type)) return this.tokens[this.current++];

        let customMessage = message;
        
        if (!customMessage) {
            const hint = SUGGESTIONS[expected[0]];
            customMessage = hint
                ? hint
                : `Esperaba un elemento de tipo '${expected.join(' o ')}'`;
        }

        throw new ChordError({
            phase: ErrorLevel.Parser,
            message: token.type === TokenType.EOF ? `${customMessage}. (El archivo termina antes)` : `${customMessage}. (En su lugar se encontró '${token.value}')`,
            location: token.location
        });
    }
}
