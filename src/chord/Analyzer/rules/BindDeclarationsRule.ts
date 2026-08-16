import { AnalysisRule } from "../AnalysisRule";
import { walkAST } from "../walkAST";
import { ASTNode, BaseNode, ClassNode, FunctionNode, PropertyNode, SymbolKind, TokenType, VariableNode } from "../../types";

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
        switch (node.type) {
            case TokenType.Clase: {
                const classNode = node as unknown as ClassNode<T, N>;
                this.context.symbolTable.register(classNode.id, { name: classNode.id, kind: SymbolKind.Class }, node.location);
                this.context.symbolTable.pushScope();
                break;
            }
            case TokenType.Funcion: {
                const functionNode = node as unknown as FunctionNode<T, N>;
                this.context.symbolTable.register(functionNode.id, { name: functionNode.id, kind: SymbolKind.Function }, node.location);
                this.context.symbolTable.pushScope();
                break;
            }
            case TokenType.VARIABLE: {
                const variableNode = node as unknown as VariableNode<T, N>;
                this.context.symbolTable.register(variableNode.id, { name: variableNode.id, kind: SymbolKind.Variable }, node.location);
                break;
            }
            case TokenType.PROPIEDAD: {
                const propertyNode = node as unknown as PropertyNode<T, N>;
                this.context.symbolTable.register(propertyNode.id, { name: propertyNode.id, kind: SymbolKind.Property }, node.location);
                break;
            }
        }
    }

    private exit (node: ASTNode<T, N>): void {
        if (node.type === TokenType.Clase || node.type === TokenType.Funcion) {
            this.context.symbolTable.popScope();
        }
    }
}
