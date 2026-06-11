import { TokenTypeUnion } from "./types";

/**
 * Registry and manager for protected reserved keywords and syntax identifiers within the Chord language.
 * Handles casing-insensitive lookups and allows runtime semantic extensions for custom framework injections.
 * @class KeyWords
 * @template {string} T - Extensible custom token type bindings vector mapping external plugins.
 */
export class KeyWords <T extends string> {
    /**
     * Internal map associating low-level text literals with their official TokenType values.
     * @private
     */
    private KeywordsList: Map<string, TokenTypeUnion<T>> = new Map();

    /**
     * @constructor
     */
    constructor () {}

    /**
     * Dynamically registers custom external extensions or framework keywords into the active scanner registry.
     * @param {Record<string, TokenTypeUnion<T>>} extensions - Key-value map pairing string keywords to extended token types.     * @returns {void}
     */
    public extend (extensions: Record<string, TokenTypeUnion<T>>): void {
        for (const [keyword, tokenType] of Object.entries(extensions)) {
            this.KeywordsList.set(keyword.toLowerCase(), tokenType);
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
     * @returns {TokenTypeUnion<T> | undefined} The matched token type mapping, or undefined if non-existent.
    */
    public resolve(identifier: string): TokenTypeUnion<T> | undefined {
        return this.KeywordsList.get(identifier.toLowerCase());
    }

    /**
     * Retrieves a clean array list containing all currently loaded system string keywords.
     * @returns {TokenTypeUnion<T>[]} An array containing all valid string keywords.
     */
    public getKeywordsList(): TokenTypeUnion<T>[] {
        return Array.from(this.KeywordsList.keys()) as TokenTypeUnion<T>[];
    }
}
