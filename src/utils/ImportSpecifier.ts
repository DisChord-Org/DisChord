import path from "path";
import { PosixPath } from "./PosixPath";

/**
 * Computes the relative specifier (always starting with `./` or `../`, with `/` separators) with
 * which one file imports another. Pure path arithmetic, so the analyzer (which inserts imports of the
 * shared modules) and the generator (which re-relativizes the imports of a file it writes elsewhere)
 * can both use it.
 * @class ImportSpecifier
 */
export class ImportSpecifier {
    /**
     * What an `importar` path starts with to name an installed library (`lib:ent`) instead of a file.
     */
    public static readonly LIB_PREFIX = 'lib:';

    /**
     * @param {string} specifier - The path of an `importar`, as written.
     * @returns {boolean} Whether it names an installed library.
     */
    public static isLibrary (specifier: string): boolean {
        return specifier.startsWith(ImportSpecifier.LIB_PREFIX);
    }

    /**
     * @param {string} fromDirectory - Absolute path of the directory the import is written from.
     * @param {string} absoluteTarget - Absolute path of the imported file.
     * @returns {string} The specifier of `absoluteTarget` from `fromDirectory`, with `/` separators and a leading `./` when it doesn't climb.
     */
    public static relative (fromDirectory: string, absoluteTarget: string): string {
        const specifier = PosixPath.of(path.relative(fromDirectory, absoluteTarget));

        return specifier.startsWith('.') ? specifier : `./${specifier}`;
    }
}
