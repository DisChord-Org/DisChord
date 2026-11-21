import { BaseChordError } from "./BaseChordError";
import { ChordErrorLevels, ErrorPayload, ErrorType } from "./types";

/** Critical core engine error. Defaults to FATAL. */
export class ChordError extends BaseChordError {
    constructor(payload: ErrorPayload<ChordErrorLevels>) {
        super(ErrorType.Fatal, payload);
        this.name = 'ChordError';
    }
}