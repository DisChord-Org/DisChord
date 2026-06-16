import { AssignmentNode, BaseNode, TokenType, TokenTypeUnion } from "../../types";
import { SubGenerator } from "../SubGenerator";

/**
 * Atomic SubGenerator to handle state mutation variables and reference assignments.
 * @class AssignmentVisitor
 * @extends {SubGenerator<T, N>}
 * @template {string} T - Extensible token type string vector.
 * @template {BaseNode<T>} N - Extensible abstract syntax tree node layout.
 */
export class AssignmentVisitor<T extends string, N extends BaseNode<T>> extends SubGenerator<T, N> {
    /**
     * The node type string that triggers the activation of this specific sub-generator.
     * @public
     * @static
     */
    public static triggerToken: TokenTypeUnion<TokenType> | undefined = TokenType.ASIGNACION;

    /**
     * Generates a standard JavaScript assignment token expression.
     * @param {AssignmentNode<T, N>} node - The structural assignment mutation syntax tree node.
     * @returns {string} The transpiled expression mapping the target assignment instruction.
     * @public
     */
    public visit(node: AssignmentNode<T, N>): string {
        return `${this.parent.visit(node.left)} = ${this.parent.visit(node.assignment)}`;
    }
}