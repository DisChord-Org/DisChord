import { Location, Token, TokenType } from "./model/types";

/** A run of plain text between two expressions, as offsets into the content of the text. */
type TextPart = {
    text: string;
    from: number;
    to: number
};

/** An expression between braces: its code, where it starts, and where its `{` and `}` are. */
type CodePart = {
    code: string;
    offset: number;
    open: number;
    close: number
};

/**
 * An interpolated text (`"hola {n}!"`) read by the Lexer: rewrites it to the tokens of the
 * concatenation `("hola " mas (n) mas "!")` and places the tokens of the expressions inside it
 * where they are in the file, so an error points into the text.
 */
export class InterpolatedText<T extends string> {
    /** Where each line of the content starts; computed once per text, when first needed. */
    private lineStarts?: number[];

    /**
     * @param text - The token of the text, with its content without the quotes.
     * @param tokenize - Tokenizes the code written between the braces.
     */
    constructor(
        private readonly text: Token<T>,
        private readonly tokenize: (code: string) => Token<T>[]
    ) {}

    /**
     * The tokens that replace the text. Each fragment of text spans exactly what it was read from,
     * and what the rewrite invents (the parentheses, `mas`, and an empty text that opens the whole)
     * is marked `synthetic` and has no width: the `(` and `mas` of an expression sit at its `{`,
     * its `)` at its `}`, the outer parentheses at the start and at the end of the literal.
     */
    public toTokens(): Token<T>[] {
        // without braces there is no expression and nothing to unescape
        if (!/[{}]/.test(this.text.value)) return [ this.text ];

        const split = this.splitParts();

        if (!split.found) return [ split.unescaped === this.text.value ? this.text : { ...this.text, value: split.unescaped } ];

        return this.assemble(split.parts);
    }

    /**
     * Splits the content of the text into runs of plain text and expressions. `{{` and `}}` are a
     * single brace of plain text, and a `{` that does not open an expression (it has no closing `}`,
     * does not start with a name, or holds another `{`) is plain text too.
     * @returns The parts, whether there is any expression, and the content with its braces unescaped.
     */
    private splitParts(): { parts: (TextPart | CodePart)[]; found: boolean; unescaped: string } {
        const value = this.text.value;
        const parts: (TextPart | CodePart)[] = [];
        let buffer = '';
        let bufferStart = 0;
        let found = false;
        let index = 0;

        while (index < value.length) {
            const char = value[index];

            if ((char === '{' || char === '}') && value[index + 1] === char) {
                buffer += char;
                index += 2;
                continue;
            }

            if (char === '{') {
                const close = value.indexOf('}', index + 1);
                const code = close === -1 ? '' : value.slice(index + 1, close);

                if (close !== -1 && /^\s*[\p{L}_]/u.test(code) && !code.includes('{')) {
                    parts.push({ text: buffer, from: bufferStart, to: index }, { code, offset: index + 1, open: index, close });
                    buffer = '';
                    found = true;
                    index = close + 1;
                    bufferStart = index;
                    continue;
                }
            }

            buffer += char;
            index++;
        }

        if (found) parts.push({ text: buffer, from: bufferStart, to: value.length });

        return { parts, found, unescaped: buffer };
    }

    /** Builds the tokens of the concatenation out of the parts of a text that has expressions. */
    private assemble(parts: (TextPart | CodePart)[]): Token<T>[] {
        const result: Token<T>[] = [ this.synthetic(TokenType.L_PAREN, '(', this.text.location) ];
        let first = true;

        for (const part of parts) {
            if ('code' in part) {
                const open = this.locate(part.open);
                const close = this.locate(part.close);

                // the text always comes first, so the whole is a text however the expression is
                if (first) result.push(this.synthetic(TokenType.TEXTO, '', this.locate(0)));

                result.push(this.synthetic(TokenType.Mas, 'mas', open), this.synthetic(TokenType.L_PAREN, '(', open));
                result.push(...this.tokenizeInside(part.code, part.offset));
                result.push(this.synthetic(TokenType.R_PAREN, ')', close));
                first = false;
                continue;
            }

            if (part.text === '' && (!first || parts.length > 1)) continue;

            if (!first) result.push(this.synthetic(TokenType.Mas, 'mas', this.locate(part.from)));
            result.push({ ...this.text, value: part.text, location: this.locate(part.from), end: this.locate(part.to) });
            first = false;
        }

        result.push(this.synthetic(TokenType.R_PAREN, ')', this.text.end));

        return result;
    }

    /** A token invented by the rewrite: without width and marked `synthetic`. */
    private synthetic(type: TokenType, value: string, at: Location): Token<T> {
        return { type, value, location: at, end: at, synthetic: true } as Token<T>;
    }

    /**
     * Tokenizes the expression written inside the braces of an interpolated text, with its tokens
     * placed where they are in the file so an error points into the text.
     */
    private tokenizeInside(code: string, offset: number): Token<T>[] {
        const start = this.locate(offset);

        const place = (at: Location): Location => at.line === 1
            ? { line: start.line, column: start.column + at.column - 1 }
            : { line: start.line + at.line - 1, column: at.column };

        return this.tokenize(code).map(token => ({ ...token, location: place(token.location), end: place(token.end) }));
    }

    /**
     * Where the character at `offset` of the text's content is in the file: the content starts right
     * after the opening quote, and a new line inside the text starts a new line of the file.
     */
    private locate(offset: number): Location {
        const starts = this.lineStarts ??= this.findLineStarts();

        // the last line that starts at `offset` or before
        let low = 0;
        let high = starts.length - 1;

        while (low < high) {
            const mid = (low + high + 1) >> 1;
            if (starts[mid] <= offset) low = mid; else high = mid - 1;
        }

        return low === 0
            ? { line: this.text.location.line, column: this.text.location.column + 1 + offset }
            : { line: this.text.location.line + low, column: offset - starts[low] + 1 };
    }

    /** The offsets in the content where each line starts. */
    private findLineStarts(): number[] {
        const value = this.text.value;
        const starts = [ 0 ];

        for (let i = value.indexOf('\n'); i !== -1; i = value.indexOf('\n', i + 1)) starts.push(i + 1);

        return starts;
    }
}
