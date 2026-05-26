import { DisChordTokenType } from "../dischord/types";
import { TokenType } from "./types";

/**
 * @file keywords.ts
 * @description Zero-maintenance dynamic keyword registry for the Chord compiler.
 */

export class KeyWords <T extends string = TokenType> {
    /**
     * Internal map associating low-level text literals with their official TokenType values.
     * @private
     */
    private KeywordsList: Map<string, T> = new Map();

    /**
     * @constructor
     */
    constructor () {}

    /**
     * Dynamically registers custom external extensions or framework keywords into the active scanner registry.
     * @param {Record<string, DisChordTokenType>} extensions - Key-value map pairing string keywords to extended token types.
     * @returns {void}
     */
    public extend <E extends T> (extensions: Record<string, E>): void {
        for (const [keyword, tokenType] of Object.entries(extensions)) {
            this.KeywordsList.set(keyword.toLowerCase(), tokenType as unknown as T);
        }
    }

    /**
     * Checks whether a scanned text identifier matches a protected reserved word registry entry.
     * @param {string} identifier - The raw source text identifier to evaluate.
     * @returns {boolean} True if the identifier is a locked reserved keyword.
     */
    public isKeyword(identifier: string): boolean {
        return this.KeywordsList.has(identifier.toLowerCase());
    }

    /**
     * Resolves a protected string keyword back to its designated strict compilation type token identifier.
     * @param {string} identifier - The raw source text to extract types from.
     * @returns {T | undefined} The matched token type mapping, or undefined if non-existent.
     */
    public resolve(identifier: string): T | undefined {
        return this.KeywordsList.get(identifier.toLowerCase());
    }

    /**
     * Retrieves a clean array list containing all currently loaded system string keywords.
     * @returns {T[]} An array containing all valid string keywords.
     */
    public getKeywordsList(): T[] {
        return Array.from(this.KeywordsList.keys()) as T[];
    }
}
