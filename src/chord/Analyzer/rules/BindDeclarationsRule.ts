import { AnalysisRule } from "../AnalysisRule";
import { walkAST } from "../walkAST";
import { isClassNode, isFunctionNode, isPropertyNode, isVariableNode } from "../../ast.guards";
import { ASTNode, BaseNode, SymbolKind, TokenType } from "../../types";

/**
 * Pass 2 of the Analyzer's binding model ("Variables"): walks the complete AST and registers
 * every chord-level declaration (classes, functions, variables, properties) into the
 * `SymbolTable`, regardless of where in the file it appears. Since this runs over the whole tree
 * before anything validates references against it, declarations are visible to each other
 * independently of source order — unlike the old parser-time registration, which only saw
 * whatever had already been parsed earlier in the same left-to-right pass.
 *
 * Classes and functions get their own lexical scope for their body, entered/exited via `walkAST`'s
 * `exit` hook — mirroring what `ClassParser`/`BlockParser` used to do at parse time.
 */
export class BindDeclarationsRule<T extends string, N extends BaseNode<T>> extends AnalysisRule<T, N> {
    /**
     * @override
     */
    check (nodes: ASTNode<T, N>[]): void {
        nodes.forEach(node => walkAST<T, N>(node, current => this.enter(current), current => this.exit(current)));
    }

    private enter (node: ASTNode<T, N>): void {
        if (isClassNode(node)) {
            this.context.symbolTable.register(node.id, {
                name: node.id,
                kind: SymbolKind.Class
            }, node.location);

            this.context.symbolTable.pushScope();

        } else if (isFunctionNode(node)) {
            this.context.symbolTable.register(node.id, {
                name: node.id,
                kind: SymbolKind.Function,
                metadata: {
                    isAsync: node.metadata.isAsync
                }
            }, node.location);

            this.context.symbolTable.pushScope();

        } else if (isVariableNode(node)) {
            this.context.symbolTable.register(node.id, {
                name: node.id,
                kind: SymbolKind.Variable
            }, node.location);
        
        } else if (isPropertyNode(node)) {
            this.context.symbolTable.register(node.id, {
                name: node.id,
                kind: SymbolKind.Property
            }, node.location);
        }
    }

    private exit (node: ASTNode<T, N>): void {
        if (node.type === TokenType.Clase || node.type === TokenType.Funcion) {
            this.context.symbolTable.popScope();
        }
    }
}
