import { BaseNode, BinaryExpressionNode, TokenType, TokenTypeUnion } from "../../types";
import { SubGenerator } from "../SubGenerator";

/**
 * Atomic SubGenerator compiling mathematical, relational, and logical infix expressions.
 * @class BinaryExpressionVisitor
 * @extends {SubGenerator<T, N>}
 * @template {string} T - Extensible token type string vector.
 * @template {BaseNode<T>} N - Extensible abstract syntax tree node layout.
 */
export class BinaryExpressionVisitor<T extends string, N extends BaseNode<T>> extends SubGenerator<T, N> {
    /**
     * The node type string that triggers the activation of this specific sub-generator.
     * @public
     * @static
     */
    public static triggerToken: TokenTypeUnion<TokenType> | undefined = TokenType.EXPRESION_BINARIA;

    /**
     * Internal operational translation map pairing Chord TokenType string values 
     * directly with their structural JavaScript output operator symbols.
     * @private
     * @readonly
     */
    private readonly operatorsMap: Record<string, string> = {
        [TokenType.Mas]: "+",
        [TokenType.Menos]: "-",
        [TokenType.Por]: "*",
        [TokenType.Entre]: "/",
        [TokenType.Resto]: "%",
        [TokenType.Exponente]: "**",
        [TokenType.Mayor]: ">",
        [TokenType.Menor]: "<",
        [TokenType.MayorIgual]: ">=",
        [TokenType.MenorIgual]: "<=",
        [TokenType.Igual]: "==",
        [TokenType.IgualTipado]: "===",
        [TokenType.NoIgual]: "!=",
        [TokenType.NoIgualTipado]: "!==",
        [TokenType.Y]: "&&",
        [TokenType.O]: "||"
    };

    /**
     * Resolves a binary infix operation by translating the operator token and generating both side leaves.
     * @param {BinaryExpressionNode<T, N>} node - The operational binary syntax tree node.
     * @returns {string} The runnable JavaScript inline equation string expression.
     * @public
     */
    public visit(node: BinaryExpressionNode<T, N>): string {
        const operation = this.operatorsMap[node.operator];

        if (!operation) {
            return `${this.parent.visit(node.left)} ${node.operator} ${this.parent.visit(node.right)}`;
        }

        return `${this.parent.visit(node.left)} ${operation} ${this.parent.visit(node.right)}`;
    }
}