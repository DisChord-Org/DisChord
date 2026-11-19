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

    /**
     * @param {string} name - A name.
     * @param {Iterable<string>} candidates - The names it could have been meant for.
     * @param {number} maxDistance - The most edits a candidate may be away and still be suggested.
     * @returns {string | undefined} The nearest candidate, if one is within `maxDistance` edits.
     */
    public static closest (name: string, candidates: Iterable<string>, maxDistance: number): string | undefined {
        let best: string | undefined;
        let bestDistance = maxDistance + 1;

        for (const candidate of candidates) {
            const distance = EditDistance.between(name, candidate);

            if (distance < bestDistance) {
                best = candidate;
                bestDistance = distance;
            }
        }

        return best;
    }
}
