
/**
 * Builds a lookup table with no prototype, so a name written in the source (`constructor`,
 * `toString`...) is never found among the keys it inherits from `Object.prototype`.
 * @param entries - The table's own entries.
 */
export function dictionary<V> (entries: Record<string, V>): Record<string, V> {
    return Object.assign(Object.create(null), entries);
}
