import { AnalysisRule } from "../AnalysisRule";
import { ASTNode, BaseNode, TokenType } from "../../model/types";

/**
 * Rejects the statements that sit where the JavaScript they become is not valid: `salir` outside a
 * loop (or in a function declared inside one, which a `break` cannot cross), `devolver` outside a
 * function, a command or an event, and `exportar` anywhere but the top level of the file. Each is
 * a SyntaxError when the generated file loads, so it is better said here, at the statement.
 */
export class ValidateStatementPlacementRule<T extends string, N extends BaseNode<T>> extends AnalysisRule<T, N> {
    /**
     * The loops that enclose the node being visited, one count for each body that runs by itself
     * (the file, then every function, command or event inside it), innermost last.
     */
    private readonly loops: number[] = [ 0 ];

    /**
     * @override
     */
    check (nodes: ASTNode<T, N>[]): void {
        const topLevel = new Set<ASTNode<T, N>>(nodes);

        this.walk(nodes, node => this.enter(node, topLevel), node => this.exit(node));
    }

    private enter (node: ASTNode<T, N>, topLevel: Set<ASTNode<T, N>>): void {
        if (this.context.symbolTable.isCallable(node)) this.loops.push(0);
        if (node.type === TokenType.BUCLE) this.loops[this.loops.length - 1]++;

        if (node.type === TokenType.Salir && this.loops[this.loops.length - 1] === 0) this.fail(`'salir' solo puede usarse dentro de un bucle 'para'.`, node);

        if (node.type === TokenType.Devolver && this.loops.length === 1) this.fail(`'devolver' solo puede usarse dentro de una función, un comando o un evento.`, node);

        if (node.type === TokenType.Exportar && !topLevel.has(node)) this.fail(`'exportar' solo puede usarse en el nivel superior del archivo, no dentro de una función, una clase o un bloque.`, node);
    }

    private exit (node: ASTNode<T, N>): void {
        if (this.context.symbolTable.isCallable(node)) this.loops.pop();
        if (node.type === TokenType.BUCLE) this.loops[this.loops.length - 1]--;
    }
}
