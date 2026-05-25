import { Location } from "./chord/types";

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

/**
 * Named payload structure to initialize any compiler lifecycle exception.
 * @interface ErrorPayload
 */
export interface ErrorPayload<P> {
    phase: P;
    message: string;
    location?: Location;
    rawLine?: string;
}

/** Abstract base class for error handling with location support and source code snippets. */
abstract class BaseChordError extends Error {
    public phase: ErrorLevel;
    public type: ErrorType;
    public location?: Location;

    /**
     * @param phase Lifecycle phase where the error occurred.
     * @param message Description of the error.
     * @param type Severity level.
     * @param location Source code coordinates (line/column).
     */
    constructor(type: ErrorType, payload: ErrorPayload<ErrorLevel>) {
        super(payload.message);
        this.type = type;
        this.phase = payload.phase;
        this.location = payload.location;
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

/** Allowed error levels for the core Chord engine. */
type ChordErrorLevels = ErrorLevel.Lexer | ErrorLevel.Parser | ErrorLevel.Compiler;

/** Critical core engine error. Defaults to FATAL. */
export class ChordError extends BaseChordError {
    constructor(payload: ErrorPayload<ChordErrorLevels>) {
        super(ErrorType.Fatal, payload);
        this.name = 'ChordError';
    }
}

/** Allowed error levels for the DisChord abstraction layer. */
type DisChordErrorLevels = ErrorLevel.Parser | ErrorLevel.Compiler | ErrorLevel.Execution;

/** Abstraction layer error. Defaults to ERROR. */
export class DisChordError extends BaseChordError {
    constructor(payload: ErrorPayload<DisChordErrorLevels>) {
        super(ErrorType.Error, payload);
        this.name = 'DisChordError';
    }
}