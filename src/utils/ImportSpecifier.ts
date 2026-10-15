import path from "path";

/**
 * Computes the relative specifier (always starting with `./` or `../`, with `/` separators) with
 * which one file imports another. Pure path arithmetic, so the analyzer (which inserts imports of the
 * shared modules) and the generator (which re-relativizes the imports of a file it writes elsewhere)
 * can both use it.
 * @class ImportSpecifier
 */
export class ImportSpecifier {
    /**
     * @param {string} fromDirectory - Absolute path of the directory the import is written from.
     * @param {string} absoluteTarget - Absolute path of the imported file.
     * @returns {string} The specifier of `absoluteTarget` from `fromDirectory`, with `/` separators and a leading `./` when it doesn't climb.
     */
    public static relative (fromDirectory: string, absoluteTarget: string): string {
        const specifier = path.relative(fromDirectory, absoluteTarget).split(path.sep).join('/');

        return specifier.startsWith('.') ? specifier : `./${specifier}`;
    }
}
