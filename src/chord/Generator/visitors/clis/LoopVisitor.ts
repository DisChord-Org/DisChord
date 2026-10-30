import { LoopNode, BaseNode, SyntaxFunction, TokenType, TokenTypeUnion, ASTNode, CallNode } from "../../../model/types";
import { isIdentificatorNode } from "../../../ast.guards";
import { SubGenerator } from "../../SubGenerator";
import { walkAST } from "../../../walkAST";

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

        if (node.iterable.type === TokenType.LLAMADA) {
            const callNode = node.iterable as CallNode<T, N>;

            if (isIdentificatorNode(callNode.object) && callNode.object.value === SyntaxFunction.Rango) {
                const args = callNode.params;
                let start = "0";
                let end = this.parent.visit(args[0]);

                if (args.length === 2) {
                    start = this.parent.visit(args[0]);
                    end = this.parent.visit(args[1]);
                }
                
                return `for (let ${varName} = ${start}; ${varName} < ${end}; ${varName}++) {\n${body}\n}`;
            }
        }

        if (this.runsCode(node.iterable)) {
            return `for (let ${varName} of ((value) => ${this.sequenceOf('value')})(${iterable})) {\n${body}\n}`;
        }

        return `for (let ${varName} of (${this.sequenceOf(iterable)})) {\n${body}\n}`;
    }

    /**
     * The JavaScript expression of what a loop walks for `iterable`, decided when it runs: a list,
     * a text (character by character, as `for...of` does, so by UTF-16 code points), a set and a
     * map's keys are walked as they are, and anything else (an object) by its keys.
     * @param {string} iterable - Source of the iterated expression, which it evaluates more than once.
     * @returns {string} A conditional expression.
     * @private
     */
    private sequenceOf(iterable: string): string {
        return `Array.isArray(${iterable}) || typeof ${iterable} === 'string' || ${iterable} instanceof Set ? ${iterable} : ${iterable} instanceof Map ? ${iterable}.keys() : Object.keys(${iterable})`;
    }

    /**
     * @param {ASTNode<T, N>} node - An expression.
     * @returns {boolean} Whether evaluating it can run code, so evaluating it twice is not safe.
     * @private
     */
    private runsCode(node: ASTNode<T, N>): boolean {
        let runs = false;

        walkAST<T, N>(node, current => {
            if (current.type === TokenType.LLAMADA || current.type === TokenType.Nuevo) runs = true;
        });

        return runs;
    }
}