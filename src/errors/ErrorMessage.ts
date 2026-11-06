/**
 * The message of whatever was thrown.
 */
export class ErrorMessage {
    /**
     * An `Error` has a message, anything else is stringified.
     *
     * @param {unknown} error - The thrown value.
     * @returns {string}
     */
    public static of(error: unknown): string {
        return error instanceof Error ? error.message : String(error);
    }
}
