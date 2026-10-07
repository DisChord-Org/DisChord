import { AnalysisRule } from "../AnalysisRule";
import { walkAST } from "../../walkAST";
import { isClassNode, isFunctionNode, isPropertyNode, isVariableNode } from "../../ast.guards";
import { ASTNode, BaseNode, CompilerMetadataKind, SymbolKind } from "../../types";

/**
 * Pass 2 of the Analyzer's binding model ("Variables"): walks the complete AST and registers
 * every chord-level declaration (classes, functions, variables, properties) into the
 * `SymbolTable`, regardless of where in the file it appears. Since this runs over the whole tree
 * before anything validates references against it, declarations are visible to each other
 * independently of source order — unlike the old parser-time registration, which only saw
 * whatever had already been parsed earlier in the same left-to-right pass.
 *
 * Classes and functions (and whatever else the dialect declares through `SymbolTable.registerScopeOwner`)
 * get their own lexical scope for their body, bound to their node and entered/exited by its own
 * `enter`/`exit` hooks. Later passes reopen the same scope through `enterScope(node)`, and this is the only
 * pass that registers symbols in them.
 */
export class BindDeclarationsRule<T extends string, N extends BaseNode<T>> extends AnalysisRule<T, N> {
    /**
     * @override
     */
    check (nodes: ASTNode<T, N>[]): void {
        nodes.forEach(node => walkAST<T, N>(node, current => this.enter(current), current => this.exit(current)));
    }

    private enter (node: ASTNode<T, N>): void {
        if (!isClassNode(node) && !isFunctionNode(node) && this.context.symbolTable.ownsScope(node)) {
            this.context.symbolTable.enterScope(node);
        }

        if (isClassNode(node)) {
            this.context.symbolTable.register(node.id, {
                name: node.id,
                kind: SymbolKind.Class
            }, node.location);

            this.context.symbolTable.enterScope(node);
            this.context.symbolTable.registerClass(node.id, node.superClass);
            this.context.symbolTable.setMetadata(CompilerMetadataKind.CurrentClass, node.id);

        } else if (isFunctionNode(node)) {
            this.context.symbolTable.register(node.id, {
                name: node.id,
                kind: SymbolKind.Function,
                metadata: {
                    isAsync: node.metadata.isAsync
                },
                signature: { params: node.params.map((_, index) => node.paramTypes?.[index]), returns: node.returnType }
            }, node.location);

            this.context.symbolTable.enterScope(node);

            node.params.forEach((param, index) => {
                this.context.symbolTable.register(param, {
                    name: param,
                    kind: SymbolKind.Variable,
                    dataType: node.paramTypes?.[index]
                }, node.location);
            });

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
        if (this.context.symbolTable.ownsScope(node)) {
            this.context.symbolTable.exitScope();
        }
    }
}
