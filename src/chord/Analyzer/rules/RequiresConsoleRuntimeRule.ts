import path from "node:path";
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
 * itself needs zero special-casing for this. The module's *content* is registered into
 * `context.extraFiles` (see `CompilationContext.extraFiles`) so `CompileCommand` writes it once,
 * the same generic path any phase uses to ask for an extra file.
 */
export class RequiresConsoleRuntimeRule<T extends string, N extends BaseNode<T>> extends AnalysisRule<T, N> {
    /**
     * @override
     */
    check (nodes: ASTNode<T, N>[]): void {
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

        if (!needsConsoleRuntime) return;

        const importNode: ImportNode<T> = {
            type: TokenType.Importar,
            identificators: [],
            path: buildSharedModuleImportSpecifier(this.context, consoleRuntimeModulePath),
            isDestructured: false,
            location: { line: 0, column: 0 }
        };

        nodes.unshift(importNode);

        this.context.extraFiles.set(path.join(this.context.projectRoot, 'dist', consoleRuntimeModulePath), consoleRuntimeModuleContent);
    }
}
