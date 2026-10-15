import path from "node:path";
import { AnalysisRule } from "../AnalysisRule";
import { ASTNode, BaseNode, ImportNode, TokenType } from "../../model/types";
import { consoleRuntimeModuleContent, consoleRuntimeModulePath } from "../../corelib";
import { isAccessNode, isCallNode, isIdentificatorNode } from "../../ast.guards";
import { SharedModuleSpecifier } from "../SharedModuleSpecifier";

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

        this.walkScoped(nodes, current => {
            if (needsConsoleRuntime) return;

            if (isAccessNode(current) && this.context.coreLib.resolveStatic(current)?.qualifiedName === 'consola.imprimir') {
                needsConsoleRuntime = true;
                return;
            }

            // a free function that falls back to `console.log` (dischord's `imprimir`, when there is no client)
            if (isCallNode(current) && isIdentificatorNode(current.object)) {
                const callee = this.context.coreLib.resolveFunction(current.object, this.context.symbolTable);

                if (callee?.includes('console.log')) needsConsoleRuntime = true;
            }
        });

        if (!needsConsoleRuntime) return;

        const importNode: ImportNode<T> = {
            type: TokenType.Importar,
            identificators: [],
            path: SharedModuleSpecifier.of(this.context, consoleRuntimeModulePath),
            isDestructured: false,
            location: { line: 0, column: 0 }
        };

        nodes.unshift(importNode);

        this.context.extraFiles.set(path.join(this.context.distDir, consoleRuntimeModulePath), consoleRuntimeModuleContent);
    }
}
