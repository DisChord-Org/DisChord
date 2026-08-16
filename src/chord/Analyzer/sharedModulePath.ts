import path from "path";
import { CompilationContext } from "../../cli/commands/CompileCommand";

/**
 * Computes the import specifier for a shared module — one written once to
 * `<projectRoot>/dist/<modulePathRelativeToDist>` by `CompileCommand` — relative to *this
 * specific file's* own compiled output location, which can sit at any depth under `dist/` since
 * source files mirror arbitrarily nested `src/` folders.
 *
 * Lives alongside `walkAST` as a tool for `AnalysisRule`s specifically (its only callers): both
 * are what a rule needs to insert a synthetic shared-module import correctly, before generation
 * ever runs.
 * @template {string} T - Extensible token type string vector.
 * @param {CompilationContext<T>} context - The active compilation context.
 * @param {string} modulePathRelativeToDist - The shared module's path, relative to `dist/`.
 * @returns {string} A relative import specifier (always starting with `./` or `../`).
 */
export function buildSharedModuleImportSpecifier<T extends string> (context: CompilationContext<T>, modulePathRelativeToDist: string): string {
    const outputDir = context.outputDir ?? path.join(context.projectRoot, 'dist');
    const absoluteModulePath = path.join(context.projectRoot, 'dist', modulePathRelativeToDist);

    let specifier = path.relative(outputDir, absoluteModulePath).split(path.sep).join('/');
    if (!specifier.startsWith('.')) specifier = `./${specifier}`;

    return specifier;
}
