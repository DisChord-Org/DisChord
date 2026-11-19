import { Test } from "../../../Test";
import { BaseChordError } from "../../../../src/errors/ChordError";

/**
 * @class UnterminatedTextTest
 * @description Validates that a text with no closing quote is a lexer error at its opening quote, instead of swallowing the rest of the file.
 */
export class UnterminatedTextTest extends Test {
    /**
     * @type {string}
     */
    public readonly name: string = 'Unterminated Text - Test';

    /**
     * @type {string}
     */
    public readonly description: string = "It has to reject a text that is never closed, pointing at its opening quote";

    /**
     * Not a comparison with a snapshot: it compiles and reads the error, since where it points matters.
     * @override
     */
    protected override async run (): Promise<void> {
        let thrown: unknown;

        try {
            await this.compile();
        } catch (error) {
            thrown = error;
        }

        if (!(thrown instanceof BaseChordError)) throw new Error(`Expected an error of the compiler, got: ${String(thrown)}`);
        if (thrown.phase !== 'Lexer') throw new Error(`The phase should be 'Lexer', got '${thrown.phase}'`);
        if (!thrown.message.includes("Texto sin cerrar")) throw new Error(`Unexpected message: ${thrown.message}`);

        const { line, column } = thrown.location ?? { line: -1, column: -1 };
        if (line !== 2 || column !== 10) throw new Error(`The error should point at 2:10, where it opens, and points at ${line}:${column}`);
    }
}
