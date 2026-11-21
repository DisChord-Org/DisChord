import { Test } from "../../../Test";
import { BaseChordError } from "../../../../src/errors/BaseChordError";

/**
 * @class UnterminatedBlockCommentTest
 * @description Validates that a block comment with no closing `*/` is a lexer error at its `/*`, instead of dropping the rest of the file.
 */
export class UnterminatedBlockCommentTest extends Test {
    /**
     * @type {string}
     */
    public readonly name: string = 'Unterminated Block Comment - Test';

    /**
     * @type {string}
     */
    public readonly description: string = "It has to reject a block comment that is never closed, pointing at where it opens";

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
        if (!thrown.message.includes("Comentario sin cerrar")) throw new Error(`Unexpected message: ${thrown.message}`);

        const { line, column } = thrown.location ?? { line: -1, column: -1 };
        if (line !== 2 || column !== 3) throw new Error(`The error should point at 2:3, where it opens, and points at ${line}:${column}`);
    }
}
