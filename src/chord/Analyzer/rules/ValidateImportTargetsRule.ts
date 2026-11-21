import path from "node:path";
import { AnalysisRule } from "../AnalysisRule";
import { isImportNode } from "../../ast.guards";
import { ASTNode, BaseNode } from "../../model/types";
import { File } from "../../../utils/File";
import { ImportedModule } from "../../ImportedModule";

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
        this.walk(nodes, current => {
            if (!isImportNode(current)) return;

            const candidates = new ImportedModule(this.context, current.path).targets();

            if (candidates.some(candidate => File.tryOf(candidate))) return;

            this.fail(`No se encontró el módulo '${current.path}' (se buscó en: ${candidates.map(candidate => path.relative(this.context.projectRoot.absolutePath, candidate)).join(', ')}).`, current);
        });
    }
}
