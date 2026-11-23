import { EditDistance } from "./EditDistance";

/**
 * The typo suggestion the analyzer rules share: how close a name has to be to become a suggestion,
 * and the Spanish phrase that offers it.
 */
export class Suggestion {
    /** The most edits between a written name and the one it probably meant. */
    private static readonly MaxDistance = 2;

    /**
     * @param {string} name - The name that was written.
     * @param {Iterable<string>} candidates - The names it could have been meant for.
     * @returns {string | undefined} The nearest candidate, if one is within the threshold.
     */
    public static closest (name: string, candidates: Iterable<string>): string | undefined {
        return EditDistance.closest(name, candidates, Suggestion.MaxDistance);
    }

    /**
     * @param {string} name - The name that was written.
     * @param {Iterable<string>} candidates - The names it could have been meant for.
     * @returns {string} The `¿Querías decir '…'?` phrase with its leading space, or an empty string
     * when no candidate is close enough.
     */
    public static didYouMean (name: string, candidates: Iterable<string>): string {
        const close = Suggestion.closest(name, candidates);

        return close === undefined ? '' : ` ¿Querías decir '${close}'?`;
    }
}
