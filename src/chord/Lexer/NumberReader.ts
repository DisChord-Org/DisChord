import { SourceCursor } from './SourceCursor';

/** A number read from the source: its text, and whether it ends in `n` (a BigInt). */
export type NumberLiteral = {
    value: string;
    bigint: boolean
};

/** Reads the numbers of the source: decimal, binary, octal or hexadecimal, and BigInt. */
export class NumberReader {
    /** A decimal digit. */
    private static readonly DIGIT = /[0-9]/;

    /** Whether `char` is a decimal digit. */
    public static isDigit(char: string | undefined): boolean {
        return char !== undefined && NumberReader.DIGIT.test(char);
    }

    /** Reads the number the cursor is on, which must start with a digit. */
    public static read(cursor: SourceCursor): NumberLiteral {
        let value: string;

        if (cursor.peek() === "0" && /[bBoOxX]/.test(cursor.peekAt(1) ?? "")) { // bin, oct, hex
            value = cursor.advance() + cursor.advance();
            value += cursor.readWhile(char => /[0-9a-fA-F]/.test(char));
        } else {
            value = NumberReader.readDecimal(cursor);
        }

        if (cursor.peek() !== "n") return { value, bigint: false };

        return { value: value + cursor.advance(), bigint: true };
    }

    /** Reads digits with, at most, one decimal point that has a digit after it. */
    private static readDecimal(cursor: SourceCursor): string {
        let value = "";

        while (!cursor.atEnd) {
            const next = cursor.peek();

            if (NumberReader.isDigit(next)) {
                value += cursor.advance();
            } else if (next === "." && NumberReader.isDigit(cursor.peekAt(1)) && !value.includes(".")) {
                value += cursor.advance();
            } else break;
        }

        return value;
    }
}
