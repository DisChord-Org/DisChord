import { AnalysisRule } from "../AnalysisRule";
import { walkAST } from "../walkAST";
import { ASTNode, BaseNode, ImportNode, TokenType } from "../../types";
import { corelib, consoleRuntimeModuleContent, consoleRuntimeModulePath } from "../../Generator/core.lib";
import { buildSharedModuleImportSpecifier } from "../sharedModulePath";

/**
 * Detects, over the *complete* AST (any nesting depth — inside functions, classes, conditions,
 * loops, etc., not just top-level statements), whether the file calls a corelib helper that
 * resolves to `console.log` (e.g. `consola.imprimir`). If so, inserts a real, synthetic
 * `ImportNode` for the shared `console.log` override module at the front of `nodes` — a standard
 * compiler "lowering" step: by the time `Generator` runs, the import is just another statement in
 * the AST, rendered by the existing `ImportVisitor` like any user-written import. `Generator`
 * itself needs zero special-casing for this, and reports needing the module's *content* written
 * to `dist/` the same way it reports the import — as a plain return value, not a side channel.
 */
export class RequiresConsoleRuntimeRule<T extends string, N extends BaseNode<T>> extends AnalysisRule<T, N> {
    /**
     * @override
     */
    check (nodes: ASTNode<T, N>[]): Map<string, string> {
        let needsConsoleRuntime = false;

        nodes.forEach(node => walkAST<T, N>(node, current => {
            if (needsConsoleRuntime || current.type !== TokenType.ACCESO) return;

            const access = current as unknown as { object: ASTNode<T, N>; property: string };
            const objName = access.object.type === TokenType.IDENTIFICADOR
                ? (access.object as unknown as { value: string }).value
                : null;

            if (objName && corelib.classes[objName]?.methods?.[access.property] === 'console.log') {
                needsConsoleRuntime = true;
            }
        }));

        if (!needsConsoleRuntime) return new Map();

        const importNode: ImportNode<T> = {
            type: TokenType.Importar,
            identificators: [],
            path: buildSharedModuleImportSpecifier(this.context, consoleRuntimeModulePath),
            isDestructured: false,
            location: { line: 0, column: 0 }
        };

        nodes.unshift(importNode);

        return new Map([[ consoleRuntimeModulePath, consoleRuntimeModuleContent ]]);
    }
}
