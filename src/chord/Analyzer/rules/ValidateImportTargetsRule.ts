import path from "node:path";
import { AnalysisRule } from "../AnalysisRule";
import { walkAST } from "../../walkAST";
import { isImportNode } from "../../ast.guards";
import { ASTNode, BaseNode } from "../../types";
import { ChordError, ErrorLevel } from "../../../errors/ChordError";
import { File } from "../../../utils/File";

/**
 * Validates that every `importar` points at a module that actually exists, at analysis time —
 * instead of surfacing later as a Node `ERR_MODULE_NOT_FOUND` when the compiled file runs. Mirrors
 * how `ImportVisitor` will resolve each specifier, but against the *source* side:
 *
 * - `lib:X` → `<projectRoot>/lib/X/src/index.js`, the entry point `chord pkg install` publishes.
 * - anything else → a sibling `.chord` source (`./otro` → `otro.chord`), or the literal file when
 *   the path names a `.js` module explicitly, both relative to the importing file.
 *
 * Must run before any rule that inserts synthetic imports (e.g. `RequiresConsoleRuntimeRule`):
 * those point at generated files that only exist in `dist/`.
 */
export class ValidateImportTargetsRule<T extends string, N extends BaseNode<T>> extends AnalysisRule<T, N> {
    /**
     * @override
     */
    check (nodes: ASTNode<T, N>[]): void {
        nodes.forEach(node => walkAST<T, N>(node, current => {
            if (!isImportNode(current)) return;

            const candidates = this.resolveCandidates(current.path);

            if (candidates.some(candidate => File.tryOf(candidate))) return;

            throw new ChordError({
                phase: ErrorLevel.Analysis,
                message: `No se encontró el módulo '${current.path}' (se buscó en: ${candidates.map(candidate => path.relative(this.context.projectRoot.absolutePath, candidate)).join(', ')}).`,
                location: current.location
            });
        }));
    }

    /**
     * Every absolute path that would satisfy `specifier`; the import is valid if any one exists.
     * @param {string} specifier - The import's raw path, as written after `desde`.
     * @returns {string[]} Candidate file paths, in lookup order.
     * @private
     */
    private resolveCandidates (specifier: string): string[] {
        if (specifier.startsWith('lib:')) {
            return [ this.context.projectRoot.resolve('lib', specifier.slice('lib:'.length), 'src', 'index.js') ];
        }

        const sourceDir = this.context.codeProvider.currentFile.directory;
        const base = path.resolve(sourceDir, specifier.replace(/\.chord$/, ''));

        return [ `${base}.chord`, base ];
    }
}
