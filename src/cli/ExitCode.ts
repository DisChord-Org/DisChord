import { CommanderError } from 'commander';
import { BaseChordError } from '../errors/ChordError';

/**
 * The process exit codes of the CLI, so that whoever calls it (a script, CI, an IDE) can tell
 * "your code has errors" from "the tool could not do its job".
 *
 * @class ExitCode
 */
export class ExitCode {
    /** Everything went well. */
    public static readonly Success = 0;

    /** The compiled code has errors: a diagnostic of the compiler, or the bot failing to run. */
    public static readonly CodeErrors = 1;

    /** The tool itself could not do its job: bad usage, a missing project, a bug of the compiler. */
    public static readonly ToolFailure = 2;

    /**
     * Exit code that corresponds to whatever made a command fail.
     *
     * @param {unknown} error - The thrown value.
     * @returns {number}
     */
    public static of(error: unknown): number {
        if (error instanceof BaseChordError) return ExitCode.CodeErrors;

        // `--help` and `--version` end the command through here too, and are not failures
        if (error instanceof CommanderError) return error.exitCode === 0 ? ExitCode.Success : ExitCode.ToolFailure;

        return ExitCode.ToolFailure;
    }
}
