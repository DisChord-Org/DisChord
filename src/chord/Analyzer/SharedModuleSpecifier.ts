import path from "path";
import { CompilationContext } from "../model/CompilationContext";
import { ImportSpecifier } from "../../utils/ImportSpecifier";

/**
 * The import specifier of a shared module, as a rule inserts it: it needs the compilation context to
 * know where the file being compiled is written. The path arithmetic itself is `ImportSpecifier`'s.
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
        return ImportSpecifier.relative(context.outputDir, path.join(context.distDir, modulePathRelativeToDist));
    }
}
