import { ASTNode, LoopNode, BaseNode, TokenType, TokenTypeUnion } from "../../../model/types";
import { isRangeCall } from "../../../ast.guards";
import { SubGenerator } from "../../SubGenerator";
import { iterableHelper } from "../../../corelib";

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
     * The name the end of a `rango` is kept in while its loop runs. A name of Chord starts with a letter, so
     * no name of the user can be this one.
     * @private
     * @static
     */
    private static readonly RangeEnd = '_fin';

    /**
     * Transpiles a loop instruction node down to an optimized runnable JavaScript loop statement blocks.
     * @param {LoopNode<T, N>} node - The target loop iteration syntax tree node.
     * @returns {string} The formatted native native JavaScript loop execution string block.
     * @public
     */
    public visit(node: LoopNode<T, N>): string {
        const varName = node.var;
        const body = this.renderBlock(node.body);

        if (isRangeCall(node.iterable)) {
            // one argument is the end, two are the start and the end (the analyzer allows nothing else)
            const args = node.iterable.params;
            const endNode = args[args.length - 1];
            const start = args.length === 2 ? this.parent.visit(args[0]) : "0";
            const end = this.parent.visit(endNode);

            if (LoopVisitor.isNumberLiteral(endNode)) {
                return `for (let ${varName} = ${start}; ${varName} < ${end}; ${varName}++) {
${body}
}`;
            }

            // any other end is evaluated once, like every other thing a `para` goes over
            const kept = LoopVisitor.RangeEnd;

            return `for (let ${varName} = ${start}, ${kept} = ${end}; ${varName} < ${kept}; ${varName}++) {
${body}
}`;
        }

        const iterable = this.parent.visit(node.iterable);

        return `for (let ${varName} of ${iterableHelper}(${iterable})) {
${body}
}`;
    }

    /**
     * @returns {boolean} `true` if the node is a number written as such, which nothing in the loop can change.
     * @private
     * @static
     */
    private static isNumberLiteral<T extends string, N extends BaseNode<T>> (node: ASTNode<T, N>): boolean {
        return node.type === TokenType.LITERAL && typeof (node as { value?: unknown }).value === 'number';
    }
}
