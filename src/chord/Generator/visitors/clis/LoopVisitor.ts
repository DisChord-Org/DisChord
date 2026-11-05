import { LoopNode, BaseNode, TokenType, TokenTypeUnion, ASTNode } from "../../../model/types";
import { isRangeCall } from "../../../ast.guards";
import { SubGenerator } from "../../SubGenerator";

/**
 * Atomic SubGenerator compiling Chord loop structures ('bucle').
 * Correctly transforms syntactic 'rango' calls into traditional performance-oriented incremental C-style loops,
 * or falls back to walking a list, a text, a set or a map's keys, or an object's keys.
 * @class LoopVisitor
 * @extends {SubGenerator<T, N>}
 * @template {string} T - Extensible token type string vector.
 * @template {BaseNode<T>} N - Extensible abstract syntax tree node layout.
 */
export class LoopVisitor<T extends string, N extends BaseNode<T>> extends SubGenerator<T, N> {
    /**
     * The node type string that triggers the activation of this specific sub-generator.
     * @public
     * @static
     */
    public static triggerToken: TokenTypeUnion<TokenType> | undefined = TokenType.BUCLE;

    /**
     * Transpiles a loop instruction node down to an optimized runnable JavaScript loop statement blocks.
     * @param {LoopNode<T, N>} node - The target loop iteration syntax tree node.
     * @returns {string} The formatted native native JavaScript loop execution string block.
     * @public
     */
    public visit(node: LoopNode<T, N>): string {
        const varName = node.var;
        
        const body = node.body
            .map((n: ASTNode<T, N>) => "    " + this.parent.visitStatement(n) + ";")
            .join('\n');
            
        const iterable = this.parent.visit(node.iterable);

        if (isRangeCall(node.iterable)) {
            const args = node.iterable.params;
            let start = "0";
            let end = this.parent.visit(args[0]);

            if (args.length === 2) {
                start = this.parent.visit(args[0]);
                end = this.parent.visit(args[1]);
            }

            return `for (let ${varName} = ${start}; ${varName} < ${end}; ${varName}++) {\n${body}\n}`;
        }

        return `for (let ${varName} of chordIterable(${iterable})) {\n${body}\n}`;
    }
}
