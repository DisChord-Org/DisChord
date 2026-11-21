import { AnalysisRule } from "../AnalysisRule";
import { isImportNode } from "../../ast.guards";
import { ASTNode, BaseNode, SymbolKind } from "../../model/types";
import { ImportedModule } from "../../ImportedModule";

/**
 * Pass 1 of the Analyzer's binding model ("Imports"): walks the complete AST and registers every
 * imported identifier into the `SymbolTable` as `SymbolKind.Declaration` (its real kind is opaque
 * at this stage).
 * Runs before the "Variables" pass so imported names are already known when declarations bind.
 *
 * A destructured import of a module whose Chord source is at hand marks the names that are
 * `@asincrono` there, so a call to one is awaited like a call to a function of this file.
 */
export class BindImportsRule<T extends string, N extends BaseNode<T>> extends AnalysisRule<T, N> {
    /**
     * @override
     */
    check (nodes: ASTNode<T, N>[]): void {
        this.walk(nodes, current => {
            if (!isImportNode(current)) return;

            const asyncNames = current.isDestructured ? new ImportedModule(this.context, current.path).asyncFunctions() : new Set<string>();

            current.identificators.forEach(name => {
                this.context.symbolTable.register(name, {
                    name,
                    kind: SymbolKind.Declaration,
                    metadata: {
                        isAsync: asyncNames.has(name)
                    }
                }, current.location);
            });
        });
    }
}
