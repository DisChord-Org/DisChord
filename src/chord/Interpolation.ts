import { Location, Token, TokenType } from "./model/types";

/**
 * @file Interpolation.ts
 * @description Rewrites an interpolated text to the tokens of a concatenation, and places the tokens of the expressions inside it.
 */

/** A run of plain text between two expressions, as offsets into the content of the text. */
type TextPart = { text: string; from: number; to: number };

/** An expression between braces: its code, where it starts, and where its `{` and `}` are. */
type CodePart = { code: string; offset: number; open: number; close: number };

/**
 * Where the character at `offset` of a text's content is in the file: the content starts right
 * after the opening quote, and a new line inside the text starts a new line of the file.
 */
function locate<T extends string> (text: Token<T>, offset: number): Location {
    const before = text.value.slice(0, offset).split('\n');

    return before.length === 1
        ? { line: text.location.line, column: text.location.column + 1 + offset }
        : { line: text.location.line + before.length - 1, column: before[before.length - 1].length + 1 };
}

/**
 * Rewrites an interpolated text (`"hola {n}!"`) to the tokens of `("hola " mas (n) mas "!")`.
 * Each fragment of text spans exactly what it was read from, and what the rewrite invents (the
 * parentheses, `mas`, and an empty text that opens the whole) is marked `synthetic` and has no
 * width: the `(` and `mas` of an expression sit at its `{`, its `)` at its `}`, the outer
 * parentheses at the start and at the end of the literal.
 */
export function interpolate<T extends string> (text: Token<T>, tokenize: (code: string) => Token<T>[]): Token<T>[] {
    const split = splitParts(text.value);

    if (!split.found) return [ split.unescaped === text.value ? text : { ...text, value: split.unescaped } ];

    return assemble(text, split.parts, tokenize);
}

/**
 * Splits the content of a text into runs of plain text and expressions. `{{` and `}}` are a single
 * brace of plain text, and a `{` that does not open an expression (it has no closing `}`, does not
 * start with a name, or holds another `{`) is plain text too.
 * @returns The parts, whether there is any expression, and the content with its braces unescaped.
 */
function splitParts (value: string): { parts: (TextPart | CodePart)[]; found: boolean; unescaped: string } {
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
function assemble<T extends string> (text: Token<T>, parts: (TextPart | CodePart)[], tokenize: (code: string) => Token<T>[]): Token<T>[] {
    const synthetic = (type: TokenType, tokenValue: string, at: Location): Token<T> => ({ type, value: tokenValue, location: at, end: at, synthetic: true } as Token<T>);
    const fragment = (content: string, from: number, to: number): Token<T> => ({ ...text, value: content, location: locate(text, from), end: locate(text, to) });
    const result: Token<T>[] = [ synthetic(TokenType.L_PAREN, '(', text.location) ];
    let first = true;

    for (const part of parts) {
        if ('code' in part) {
            const open = locate(text, part.open);
            const close = locate(text, part.close);

            // the text always comes first, so the whole is a text however the expression is
            if (first) result.push(synthetic(TokenType.TEXTO, '', locate(text, 0)));

            result.push(synthetic(TokenType.Mas, 'mas', open), synthetic(TokenType.L_PAREN, '(', open));
            result.push(...tokenizeInside(text, part.code, part.offset, tokenize));
            result.push(synthetic(TokenType.R_PAREN, ')', close));
            first = false;
            continue;
        }

        if (part.text === '' && (!first || parts.length > 1)) continue;

        if (!first) result.push(synthetic(TokenType.Mas, 'mas', locate(text, part.from)));
        result.push(fragment(part.text, part.from, part.to));
        first = false;
    }

    result.push(synthetic(TokenType.R_PAREN, ')', text.end));

    return result;
}

/**
 * Tokenizes the expression written inside the braces of an interpolated text, with its tokens
 * placed where they are in the file so an error points into the text.
 */
function tokenizeInside<T extends string> (text: Token<T>, code: string, offset: number, tokenize: (code: string) => Token<T>[]): Token<T>[] {
    const start = locate(text, offset);

    const place = (at: Location): Location => at.line === 1
        ? { line: start.line, column: start.column + at.column - 1 }
        : { line: start.line + at.line - 1, column: at.column };

    return tokenize(code).map(token => ({ ...token, location: place(token.location), end: place(token.end) }));
}
