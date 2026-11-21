import { Location } from "../chord/model/tokens";
import { File } from "../utils/File";
import { Diagnostic, ErrorLevel, ErrorPayload, ErrorType } from "./types";

/** Abstract base class for error handling with location support and source code snippets. */
export abstract class BaseChordError extends Error {
    public phase: ErrorLevel;
    public type: ErrorType;
    public location?: Location;
    /** Source file the error belongs to, set by whoever knows which file was being compiled. */
    public file?: File;

    /**
     * @param type Severity level.
     * @param payload Lifecycle phase, message, source coordinates (line/column) and file of the error.
     */
    constructor(type: ErrorType, payload: ErrorPayload<ErrorLevel>) {
        super(payload.message);
        this.type = type;
        this.phase = payload.phase;
        this.location = payload.location;
        this.file = payload.file;
    }

    /**
     * Tags a compiler error with the file it belongs to; anything else is returned as it came.
     * Meant for `throw BaseChordError.attachFile(error, file)` in a `catch`.
     *
     * @param {unknown} error - The caught value.
     * @param {File} file - The file that was being compiled.
     * @returns {unknown} The same value.
     */
    public static attachFile(error: unknown, file: File): unknown {
        if (error instanceof BaseChordError) error.file = file;

        return error;
    }

    /** Converts the error into its `--json` representation. */
    public toDiagnostic(): Diagnostic {
        return {
            file: this.file?.absolutePath,
            phase: this.phase,
            severity: 'error',
            message: this.message,
            line: this.location?.line,
            column: this.location?.column
        };
    }

    /**
     * Generates a formatted multiline string with header, message, and visual pointer (^).
     * @param {string} [sourceCode] - The optional full source code context to extract the line snippet.
     * @returns {string} The formatted error message.
     */
    public format(sourceCode?: string): string {
        const location = this.location ? `[${this.location.line}:${this.location.column}]` : '';
        const header = `${this.type} ${this.phase} Error ${location}`;

        let lineSnippet = '';
        let pointer = '';

        if (sourceCode && this.location && this.location.line > 0) {
            const lines = sourceCode.split('\n');
            const rawLine = lines[this.location.line - 1] || '';
            
            lineSnippet = `\n  > ${rawLine.replace(/\t/g, ' ')}`;
            pointer = `\n    ${' '.repeat(Math.max(0, this.location.column - 1))}^`;
        }

        return `${header}\n${this.message}${lineSnippet}${pointer}`.trim();
    }
}