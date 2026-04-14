import { Location } from "./chord/types";
import { codeProvider } from "./CodeProvider";

/** Life cycle phase where the failure originated. */
export enum ErrorLevel {
    Lexer = 'Lexer',
    Parser = 'Parser',
    Compiler = 'Compilador',
    Execution = 'Ejecución'
}

/** Error severity: ERROR (recoverable) or FATAL (halts the process). */
export enum ErrorType {
    Error = 'ERROR',
    Fatal = 'FATAL'
}

/** Abstract base class for error handling with location support and source code snippets. */
abstract class BaseChordError extends Error {

    /**
     * @param phase Lifecycle phase where the error occurred.
     * @param message Description of the error.
     * @param type Severity level.
     * @param location Source code coordinates (line/column).
     */
    constructor(
        public phase: ErrorLevel,
        public message: string,
        public type: ErrorType,
        public location?: Location
    ) {
        super(message);
    }

    /**
     * Extracts the specific source line based on the error location.
     * @returns The raw line of code where the error occurred, or an empty string if unavailable.
     */
    private get rawLine(): string {
        const code = codeProvider.currentCode;
        if (!this.location || this.location.line < 1) return '';

        const lines = code.split('\n');
        return lines[this.location.line - 1] || '';
    }

    /**
     * Generates a formatted multiline string with header, message, and visual pointer (^).
     * @returns The formatted error message.
     */
    public format(): string {
        const location = this.location ? `[${this.location.line}:${this.location.column}]` : '';
        const header = `${this.type} ${this.phase} Error ${location}`;

        const line = `\n  > ${this.rawLine.replace(/\t/g, ' ')}`;
        const pointer = (this.rawLine && this.location) 
            ? `\n    ${' '.repeat(Math.max(0, this.location.column - 1))}^` 
            : '';

        return `${header}\n${this.message}${line}${pointer}`.trim();
    }
}

/** Allowed error levels for the core Chord engine. */
type ChordErrorLevels = ErrorLevel.Lexer | ErrorLevel.Parser | ErrorLevel.Compiler;

/** Critical core engine error. Defaults to FATAL. */
export class ChordError extends BaseChordError {
    constructor(phase: ChordErrorLevels, message: string, location?: Location) {
        super(phase, message, ErrorType.Fatal, location);
        this.name = 'ChordError';
    }
}

/** Allowed error levels for the DisChord abstraction layer. */
type DisChordErrorLevels = ErrorLevel.Parser | ErrorLevel.Compiler | ErrorLevel.Execution;

/** Abstraction layer error. Defaults to ERROR. */
export class DisChordError extends BaseChordError {
    constructor(phase: DisChordErrorLevels, message: string, location?: Location) {
        super(phase, message, ErrorType.Error, location);
        this.name = 'DisChordError';
    }
}