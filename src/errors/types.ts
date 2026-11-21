import { Location } from "../chord/model/tokens";
import { File } from "../utils/File";

/** Life cycle phase where the failure originated. */
export enum ErrorLevel {
    Lexer = 'Lexer',
    Parser = 'Parser',
    Analysis = 'Análisis',
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
    file?: File;
}

/** Machine-readable form of a failure, as printed by `--json`. */
export interface Diagnostic {
    file?: string;
    phase: string;
    severity: 'error';
    message: string;
    line?: number;
    column?: number;
}

/** Allowed error levels for the core Chord engine. */
export type ChordErrorLevels = ErrorLevel.Lexer | ErrorLevel.Parser | ErrorLevel.Analysis | ErrorLevel.Compiler;

/** Allowed error levels for the DisChord abstraction layer. */
export type DisChordErrorLevels = ErrorLevel.Parser | ErrorLevel.Analysis | ErrorLevel.Compiler | ErrorLevel.Execution;