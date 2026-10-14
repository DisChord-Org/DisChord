import path from "path";
import { CompilationContext } from "../model/CompilationContext";

/**
 * Computes the relative specifier (always starting with `./` or `../`, with `/` separators) with which
 * one file imports another, in the one place that does it: the shared modules a rule inserts an import
 * of, and the imports a generated file re-relativizes from the project root.
 *
 * Lives in the Analyzer folder because `AnalysisRule`s are its main callers: a rule needs it to insert a
 * synthetic shared-module import correctly, before generation ever runs.
 * @class SharedModuleSpecifier
 */
export class SharedModuleSpecifier {
    /**
     * The import specifier of a shared module — one written once to
     * `<projectRoot>/dist/<modulePathRelativeToDist>` by `CompileCommand` — relative to *this specific
     * file's* own compiled output location, which can sit at any depth under `dist/` since source files
     * mirror arbitrarily nested `src/` folders.
     * @template {string} T - Extensible token type string vector.
     * @param {CompilationContext<T>} context - The active compilation context.
     * @param {string} modulePathRelativeToDist - The shared module's path, relative to `dist/`.
     * @returns {string} A relative import specifier.
     */
    public static of<T extends string> (context: CompilationContext<T>, modulePathRelativeToDist: string): string {
        return SharedModuleSpecifier.relative(context.outputDir, path.join(context.distDir, modulePathRelativeToDist));
    }

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
