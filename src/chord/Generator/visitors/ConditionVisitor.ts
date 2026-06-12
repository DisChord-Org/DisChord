import { ConditionNode, BaseNode, TokenType, TokenTypeUnion, ASTNode } from "../../types";
import { SubGenerator } from "../SubGenerator";

/**
 * Atomic SubGenerator compiling conditional logical bifurcations.
 * Strictly mirrors the legacy core layout routing logic and indentation structures.
 * @class ConditionVisitor
 * @extends {SubGenerator<T, N>}
 * @template {string} T - Extensible token type string vector.
 * @template {BaseNode<T>} N - Extensible abstract syntax tree node layout.
 */
export class ConditionVisitor<T extends string, N extends BaseNode<T>> extends SubGenerator<T, N> {
    /**
     * The node type string that triggers the activation of this specific sub-generator.
     * @public
     * @static
     */
    public static triggerToken: TokenTypeUnion<TokenType> | undefined = TokenType.CONDICION;

    /**
     * Transpiles conditional syntactic nodes matching the legacy generator behavior.
     * @param {ConditionNode<T, N>} node - The target analytical logical condition tree node.
     * @returns {string} The formatted output runnable native JavaScript 'if/else' instruction block string.
     * @public
     */
    public visit(node: ConditionNode<T, N>): string {
        const test = this.parent.visit(node.test);
        
        const consequent = node.consequent
            .map((n: ASTNode<T, N>) => "    " + this.parent.visit(n) + ";")
            .join('\n');
        
        let result = `if (${test}) {\n${consequent}\n}`;

        if (node.alternate) {
            if (!Array.isArray(node.alternate) && node.alternate.type === 'Condicion') {
                result += ` else ${this.parent.visit(node.alternate as unknown as ASTNode<T, N>)}`;
            } else {
                const alternate = (node.alternate as ASTNode<T, N>[])
                    .map((n: ASTNode<T, N>) => "    " + this.parent.visit(n) + ";")
                    .join('\n');
                result += ` else {\n${alternate}\n}`;
            }
        }

        return result;
    }
}