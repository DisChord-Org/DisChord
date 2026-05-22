import { DisChordTokenType } from "../dischord/types";
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
    private KeywordsList: Map<DisChordTokenType, DisChordTokenType> = new Map();

    /**
     * Infers and registers keywords dynamically from the TokenType registry at runtime.
     * @constructor
     */
    constructor () {
        const isLowercaseKeyword = /^[a-z_]+$/;

        for (const value of Object.values(DisChordTokenType)) {
            if (isLowercaseKeyword.test(value)) {
                this.KeywordsList.set(value, value);
            }
        }
    }

    /**
     * Dynamically registers custom external extensions or framework keywords into the active scanner registry.
     * @param {Record<string, DisChordTokenType>} extensions - Key-value map pairing string keywords to extended token types.
     * @returns {void}
     */
    public extend <T extends DisChordTokenType> (extensions: Record<string, T>): void {
        for (const [keyword, tokenType] of Object.entries(extensions)) {
            this.KeywordsList.set(keyword.toLowerCase() as DisChordTokenType, tokenType);
        }
    }

    /**
     * Checks whether a scanned text identifier matches a protected reserved word registry entry.
     * @param {string} identifier - The raw source text identifier to evaluate.
     * @returns {boolean} True if the identifier is a locked reserved keyword.
     */
    public isKeyword(identifier: string): boolean {
        return this.KeywordsList.has(identifier.toLowerCase() as DisChordTokenType);
    }

    /**
     * Resolves a protected string keyword back to its designated strict compilation type token identifier.
     * @param {string} identifier - The raw source text to extract types from.
     * @returns {DisChordTokenType | undefined} The matched token type mapping, or undefined if non-existent.
     */
    public resolve(identifier: string): DisChordTokenType | undefined {
        return this.KeywordsList.get(identifier.toLowerCase() as DisChordTokenType);
    }

    /**
     * Retrieves a clean array list containing all currently loaded system string keywords.
     * @returns {DisChordTokenType[]} An array containing all valid string keywords.
     */
    public getKeywordsList(): DisChordTokenType[] {
        return Array.from(this.KeywordsList.keys());
    }
}
