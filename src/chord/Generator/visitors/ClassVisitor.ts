import { ClassNode, BaseNode, TokenType, TokenTypeUnion, ASTNode } from "../../types";
import { SubGenerator } from "../SubGenerator";

/**
 * Atomic SubGenerator compiling OOP Class blueprints and blueprints structural wrappers.
 * @class ClassVisitor
 * @extends {SubGenerator<T, N>}
 * @template {string} T - Extensible token type string vector.
 * @template {BaseNode<T>} N - Extensible abstract syntax tree node layout.
 */
export class ClassVisitor<T extends string, N extends BaseNode<T>> extends SubGenerator<T, N> {
    /**
     * The node type string that triggers the activation of this specific sub-generator.
     * @public
     * @static
     */
    public static triggerToken: TokenTypeUnion<TokenType> | undefined = TokenType.Clase;

    /**
     * Transpiles a Class definition syntax node matching legacy indent structures.
     * @param {ClassNode<T, N>} node - The target class analytical syntax tree node.
     * @returns {string} The fully compiled native JavaScript class code block representation.
     * @public
     */
    public visit(node: ClassNode<T, N>): string {
        const inheritance = node.superClass ? ` extends ${node.superClass}` : '';

        const body = node.body
            .map((n: ASTNode<T, N>) => "  " + this.parent.visit(n) + ";")
            .join('\n\n');
        
        return `class ${node.id}${inheritance} {\n  ${body}\n}`;
    }
}