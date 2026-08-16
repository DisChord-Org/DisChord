import { AnalysisRule } from "../AnalysisRule";
import { walkAST } from "../walkAST";
import { ASTNode, BaseNode, ImportNode, SymbolKind, TokenType } from "../../types";

/**
 * Pass 1 of the Analyzer's binding model ("Imports"): walks the complete AST and registers every
 * imported identifier into the `SymbolTable` as `SymbolKind.Declaration` (its real kind is opaque
 * at this stage — see `ClassParser.assertClassExists`'s old doc comment for why that mattered).
 * Runs before the "Variables" pass so imported names are already known when declarations bind.
 */
export class BindImportsRule<T extends string, N extends BaseNode<T>> extends AnalysisRule<T, N> {
    /**
     * @override
     */
    check (nodes: ASTNode<T, N>[]): Map<string, string> {
        nodes.forEach(node => walkAST<T, N>(node, current => {
            if (current.type !== TokenType.Importar) return;

            const importNode = current as unknown as ImportNode<T>;

            importNode.identificators.forEach(name => {
                this.context.symbolTable.register(name, {
                    name,
                    kind: SymbolKind.Declaration
                }, current.location);
            });
        }));

        return new Map();
    }
}
