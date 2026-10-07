import path from "node:path";
import { AnalysisRule } from "../AnalysisRule";
import { walkAST } from "../../walkAST";
import { ASTNode, BaseNode, ImportNode, TokenType } from "../../types";
import { coreLibUtils, runtimeHelperNames, runtimeHelpersModuleContent, runtimeHelpersModulePath } from "../../corelib";
import { isAccessNode, isCallNode, isIdentificatorNode } from "../../ast.guards";
import { buildSharedModuleImportSpecifier } from "../sharedModulePath";

/**
 * Detects, over the *complete* AST, which runtime helpers the file uses (a core library member or
 * function whose `transpile` is one `runtimeHelperNames` exports, e.g. `Mates.limitar` or
 * `esperar`), or that a call on a receiver of union type was decided to be dispatched through (`chordTiene`).
 * If any, inserts a synthetic `ImportNode` for the shared helpers module at the front
 * of `nodes`, importing only the ones used, and registers the module's content in
 * `context.extraFiles` — the same lowering `RequiresConsoleRuntimeRule` does for the console
 * override. A file that uses none gets no import.
 */
export class RequiresRuntimeHelpersRule<T extends string, N extends BaseNode<T>> extends AnalysisRule<T, N> {
    /**
     * @override
     */
    check (nodes: ASTNode<T, N>[]): void {
        const used = new Set<string>();

        const symbolTable = this.context.symbolTable;

        nodes.forEach(node => walkAST<T, N>(node, current => {
            if (symbolTable.ownsScope(current)) symbolTable.enterScope(current);

            const dispatch = isCallNode(current) ? this.context.symbolTable.dispatchOf(current) : undefined;
            const transpiled = dispatch
                ? ('helper' in dispatch ? dispatch.helper : undefined)
                : isAccessNode(current)
                    ? coreLibUtils.resolveStatic(current)?.member.transpile
                    : isCallNode(current) ? coreLibUtils.resolveFunction(current.object, this.isDeclared(current.object)) : undefined;

            if (transpiled !== undefined && runtimeHelperNames.has(transpiled)) used.add(transpiled);
        }, current => {
            if (symbolTable.ownsScope(current)) symbolTable.exitScope();
        }));

        if (used.size === 0) return;

        const importNode: ImportNode<T> = {
            type: TokenType.Importar,
            identificators: [ ...used ].sort(),
            isDestructured: true,
            path: buildSharedModuleImportSpecifier(this.context, runtimeHelpersModulePath),
            location: { line: 0, column: 0 }
        };

        nodes.unshift(importNode);

        this.context.extraFiles.set(path.join(this.context.projectRoot, 'dist', runtimeHelpersModulePath), runtimeHelpersModuleContent);
    }

    /**
     * Whether the callee is a name the file declares and that is visible where the call is, which
     * then wins over a core library function of the same name.
     * @private
     */
    private isDeclared (callee: ASTNode<T, N>): boolean {
        return isIdentificatorNode(callee) && !!this.context.symbolTable.lookup(callee.value);
    }
}
