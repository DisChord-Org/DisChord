import { Location } from "./chord/types";

export enum ErrorLevel {
    Lexer = 'Lexer',
    Parser = 'Parser',
    Compiler = 'Compilador',
    Execution = 'Ejecución'
}

export enum ErrorType {
    Error = 'ERROR',
    Fatal = 'FATAL'
}

abstract class BaseChordError extends Error {
    constructor(
        public phase: ErrorLevel,
        public message: string,
        public type: ErrorType,
        public location?: Location,
        public rawLine?: string
    ) {
        super(message);
    }

    public format(): string {
        const location = this.location ? `[${this.location.line}:${this.location.column}]` : '';
        const header = `${this.type} ${this.phase} Error ${location}`;
        
        const line = this.rawLine ? `\n  > ${this.rawLine.replace(/\t/g, ' ')}` : '';
        const pointer = (this.rawLine && this.location) 
            ? `\n    ${' '.repeat(Math.max(0, this.location.column - 1))}^` 
            : '';

        return `${header}\n${this.message}${line}${pointer}`.trim();
    }
}

export class ChordError extends BaseChordError {
    constructor(phase: ErrorLevel, message: string, location?: Location, rawLine?: string) {
        super(phase, message, ErrorType.Fatal, location, rawLine);
        this.name = 'ChordError';
    }
}

export class DisChordError extends BaseChordError {
    constructor(phase: ErrorLevel, message: string, location?: Location, rawLine?: string) {
        super(phase, message, ErrorType.Error, location, rawLine);
        this.name = 'DisChordError';
    }
}