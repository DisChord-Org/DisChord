import { BaseChordError } from "./BaseChordError";
import { DisChordErrorLevels, ErrorPayload, ErrorType } from "./types";

/** Abstraction layer error. Defaults to ERROR. */
export class DisChordError extends BaseChordError {
    constructor(payload: ErrorPayload<DisChordErrorLevels>) {
        super(ErrorType.Error, payload);
        this.name = 'DisChordError';
    }
}