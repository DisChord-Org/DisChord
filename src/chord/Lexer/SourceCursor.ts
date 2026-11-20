/**
 * A position over the text the Lexer reads: the offset of the next character and the line and
 * column it is on. It only moves forward.
 */
export class SourceCursor {
    /** Line of the next character, starting at 1. */
    public line = 1;

    /** Column of the next character, starting at 1. */
    public column = 1;

    /** Offset of the next character in the text. */
    public current = 0;

    constructor(private readonly input: string) {}

    /** Whether every character has been consumed. */
    public get atEnd(): boolean {
        return this.current >= this.input.length;
    }

    /** The next character, or an empty string at the end. */
    public peek(): string {
        return this.input[this.current] || '';
    }

    /** The character `offset` places after the next one (`undefined` past the end). */
    public peekAt(offset: number): string | undefined {
        return this.input[this.current + offset];
    }

    /** Consumes the next character and moves the line and the column. */
    public advance(): string {
        const char = this.input[this.current++];

        if (char === '\n') {
            this.line++;
            this.column = 1;
        } else {
            this.column++;
        }

        return char;
    }

    /** Consumes characters while `accept` takes them and returns what was read. */
    public readWhile(accept: (char: string) => boolean): string {
        let value = "";

        while (!this.atEnd && accept(this.peek())) value += this.advance();

        return value;
    }
}
