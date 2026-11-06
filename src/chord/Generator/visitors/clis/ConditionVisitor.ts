import { ConditionNode, BaseNode, TokenType, TokenTypeUnion, ASTNode } from "../../../model/types";
import { SubGenerator } from "../../SubGenerator";

/**
 * Atomic SubGenerator compiling conditional logical bifurcations.
 * Branches are indented by four spaces.
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
     * Transpiles conditional syntactic nodes.
     * @param {ConditionNode<T, N>} node - The target analytical logical condition tree node.
     * @returns {string} The formatted output runnable native JavaScript 'if/else' instruction block string.
     * @public
     */
    public visit(node: ConditionNode<T, N>): string {
        const test = this.parent.visit(node.test);
        
        const consequent = this.renderBlock(node.consequent);
        
        let result = `if (${test}) {\n${consequent}\n}`;

        if (node.alternate) {
            if (!Array.isArray(node.alternate) && node.alternate.type === TokenType.CONDICION) {
                result += ` else ${this.parent.visit(node.alternate as unknown as ASTNode<T, N>)}`;
            } else {
                const alternate = this.renderBlock(node.alternate as ASTNode<T, N>[]);
                result += ` else {\n${alternate}\n}`;
            }
        }

        return result;
    }
}