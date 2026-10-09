import { ClassNode, BaseNode, TokenType, TokenTypeUnion, ASTNode } from "../../../types";
import { SubGenerator } from "../../SubGenerator";

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
     * The JavaScript name of a parent class: the constructor of the core library class it names
     * (`Mapa` → `Map`), or the name itself for a class of the file (it can't be named like one of the library).
     * @private
     */
    private parentName(name: string): string {
        return this.parent.context.coreLib.resolveConstructorOf(name) ?? name;
    }

    /**
     * Transpiles a Class definition syntax node matching legacy indent structures.
     * @param {ClassNode<T, N>} node - The target class analytical syntax tree node.
     * @returns {string} The fully compiled native JavaScript class code block representation.
     * @public
     */
    public visit(node: ClassNode<T, N>): string {
        const inheritance = node.superClass ? ` extends ${this.parentName(node.superClass)}` : '';

        // Reopening the scope the analyzer bound to this node lets lookups see the class's members.
        this.parent.context.symbolTable.enterScope(node);

        const body = node.body
            .map((n: ASTNode<T, N>) => "  " + this.parent.visit(n) + ";")
            .join('\n\n');

        this.parent.context.symbolTable.exitScope();
        
        return `class ${node.id}${inheritance} {\n  ${body}\n}`;
    }
}