import { TokenType } from "./types";

/**
 * @file keywords.ts
 * @description Zero-maintenance dynamic keyword registry for the Chord compiler.
 */

export class KeyWords {
    /**
     * Internal map associating low-level text literals with their official TokenType values.
     * @private
     */
    private KeywordsList: Map<TokenType, TokenType> = new Map();

    /**
     * Infers and registers keywords dynamically from the TokenType registry at runtime.
     * @constructor
     */
    constructor () {
        const isLowercaseKeyword = /^[a-z_]+$/;

        for (const value of Object.values(TokenType)) {
            if (isLowercaseKeyword.test(value)) {
                this.KeywordsList.set(value, value);
            }
        }
    }

    /**
     * Dynamically registers custom external extensions or framework keywords into the active scanner registry.
     * @param {Record<string, TokenType>} extensions - Key-value map pairing string keywords to extended token types.
     * @returns {void}
     */
    public extend(extensions: Record<string, TokenType>): void {
        for (const [keyword, tokenType] of Object.entries(extensions)) {
            this.KeywordsList.set(keyword.toLowerCase() as TokenType, tokenType);
        }
    }

    /**
     * Checks whether a scanned text identifier matches a protected reserved word registry entry.
     * @param {string} identifier - The raw source text identifier to evaluate.
     * @returns {boolean} True if the identifier is a locked reserved keyword.
     */
    public isKeyword(identifier: string): boolean {
        return this.KeywordsList.has(identifier.toLowerCase() as TokenType);
    }

    /**
     * Resolves a protected string keyword back to its designated strict compilation type token identifier.
     * @param {string} identifier - The raw source text to extract types from.
     * @returns {TokenType | undefined} The matched token type mapping, or undefined if non-existent.
     */
    public resolve(identifier: string): TokenType | undefined {
        return this.KeywordsList.get(identifier.toLowerCase() as TokenType);
    }

    /**
     * Retrieves a clean array list containing all currently loaded system string keywords.
     * @returns {TokenType[]} An array containing all valid string keywords.
     */
    public getKeywordsList(): TokenType[] {
        return Array.from(this.KeywordsList.keys());
    }
}
