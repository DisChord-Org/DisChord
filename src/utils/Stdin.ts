/**
 * The process' standard input, read whole.
 *
 * @class Stdin
 */
export class Stdin {
    /**
     * Reads standard input until it closes.
     *
     * @returns {Promise<string>} Everything received, decoded as UTF-8.
     */
    public static async read(): Promise<string> {
        const chunks: Buffer[] = [];

        for await (const chunk of process.stdin) {
            chunks.push(typeof chunk === 'string' ? Buffer.from(chunk) : chunk);
        }

        return Buffer.concat(chunks).toString('utf-8');
    }
}
