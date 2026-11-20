import { NamedTextLiteral, Token, TokenType } from '../model/types';
import { KeyWords } from '../KeywordsManager';

/** The token type and text of a word. */
export type ClassifiedWord = {
    type: TokenType;
    text: string
};

/** Decides what a word of the source is: a keyword, an identifier, a boolean, `indefinido` or a named text. */
export class WordClassifier {
    /**
     * Reserved words are plain ASCII. A word with any other character is never looked up among
     * them, since case folding could otherwise map one onto an ASCII keyword (`K`, the Kelvin
     * sign, lowercases to `k`).
     */
    private static readonly ASCII_ONLY = /^[\u0000-\u007F]*$/;

    constructor(private readonly keywordsManager: KeyWords<string>) {}

    /**
     * @param value - The word, already normalized.
     * @param previous - The token read right before it, if any.
     */
    public classify(value: string, previous: Token<string> | undefined): ClassifiedWord {
        // A word right after `.` is always a member name, even if it is a reserved word
        // (`lista.en(0)`, `fecha.entre`), so it never goes through the keyword lookup.
        if (previous?.type === TokenType.Punto) return { type: TokenType.IDENTIFICADOR, text: value };
        if (value === TokenType.Verdadero || value === TokenType.Falso) return { type: TokenType.BOOLEANO, text: value };
        if (value === TokenType.Indefinido) return { type: TokenType.Indefinido, text: value };
        if (Object.prototype.hasOwnProperty.call(NamedTextLiteral, value)) {
            return { type: TokenType.TEXTO, text: NamedTextLiteral[value as keyof typeof NamedTextLiteral] };
        }

        const keyword = WordClassifier.ASCII_ONLY.test(value) ? this.keywordsManager.resolve(value) : undefined;

        if (keyword) return { type: keyword as TokenType, text: value };

        return { type: TokenType.IDENTIFICADOR, text: value };
    }
}
