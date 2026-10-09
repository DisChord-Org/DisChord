import path from "node:path";
import { AnalysisRule } from "../AnalysisRule";
import { ASTNode, BaseNode, ImportNode, TokenType } from "../../types";
import { runtimeHelperNames, runtimeHelpersModuleContent, runtimeHelpersModulePath } from "../../corelib";
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
        const helpers = this.collectHelpers(nodes);
        if (helpers.size === 0) return;

        this.insertImport(nodes, helpers);
    }

    /**
     * The runtime helper a node is emitted through, if any: the one the analyzer decided to dispatch
     * a call through, the `transpile` of a static core library member, or the one a free function
     * of the core library maps to (unless the file declares its own of that name).
     * @param {ASTNode<T, N>} node - Any node of the tree, with the scope it lies in open.
     * @returns {string | undefined} The helper's name, or `undefined` if the node uses none.
     * @private
     */
    private helperOf (node: ASTNode<T, N>): string | undefined {
        const dispatch = isCallNode(node) ? this.context.symbolTable.marks.dispatchOf(node) : undefined;
        const transpiled = dispatch
            ? ('helper' in dispatch ? dispatch.helper : undefined)
            : isAccessNode(node)
                ? this.context.coreLib.resolveStatic(node)?.member.transpile
                : isCallNode(node) ? this.context.coreLib.resolveFunction(node.object, this.isDeclared(node.object)) : undefined;

        return transpiled !== undefined && runtimeHelperNames.has(transpiled) ? transpiled : undefined;
    }

    /**
     * Walks the whole tree, with each node's scope open, and gathers the helpers it uses.
     * @param {ASTNode<T, N>[]} nodes - The top-level AST nodes of the file.
     * @returns {Set<string>} The names of the helpers used.
     * @private
     */
    private collectHelpers (nodes: ASTNode<T, N>[]): Set<string> {
        const helpers = new Set<string>();

        this.walkScoped(nodes, node => {
            const helper = this.helperOf(node);
            if (helper !== undefined) helpers.add(helper);
        });

        return helpers;
    }

    /**
     * Puts the import of `helpers` (sorted) at the front of the file and registers the module's
     * content as an extra file to write.
     * @private
     */
    private insertImport (nodes: ASTNode<T, N>[], helpers: Set<string>): void {
        const importNode: ImportNode<T> = {
            type: TokenType.Importar,
            identificators: [ ...helpers ].sort(),
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
