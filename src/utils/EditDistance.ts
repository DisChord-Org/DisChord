/**
 * How far apart two names are, to suggest the one a user probably meant.
 */
export class EditDistance {
    /**
     * @param {string} a - A name.
     * @param {string} b - Another name.
     * @returns {number} The number of single-character edits (insert, delete, replace) between the two.
     */
    public static between (a: string, b: string): number {
        let previous = Array.from({ length: b.length + 1 }, (_, i) => i);

        for (let i = 1; i <= a.length; i++) {
            const row = [ i ];

            for (let j = 1; j <= b.length; j++) {
                row[j] = Math.min(previous[j] + 1, row[j - 1] + 1, previous[j - 1] + (a[i - 1] === b[j - 1] ? 0 : 1));
            }

            previous = row;
        }

        return previous[b.length];
    }
}
