import { FunctionNode, BaseNode, TokenType, TokenTypeUnion, ASTNode } from "../../../types";
import { SubGenerator } from "../../SubGenerator";

/**
 * Atomic SubGenerator that handles subroutine blueprints, structural class methods, and constructors compilation.
 * @class FunctionVisitor
 * @extends {SubGenerator<T, N>}
 * @template {string} T - Extensible token type string vector.
 * @template {BaseNode<T>} N - Extensible abstract syntax tree node layout.
 */
export class FunctionVisitor<T extends string, N extends BaseNode<T>> extends SubGenerator<T, N> {
    /**
     * The node type string that triggers the activation of this specific sub-generator.
     * @public
     * @static
     */
    public static triggerToken: TokenTypeUnion<TokenType> | undefined = TokenType.Funcion;

    /**
     * Transpiles function scopes mapping async/static prefixes and structural indentation rules.
     * @param {FunctionNode<T, N>} node - The target operation definition tree node.
     * @returns {string} The runnable JavaScript function execution blueprint string.
     * @public
     */
    public visit(node: FunctionNode<T, N>): string {
        const params = node.params.join(', ');
        
        const body = node.body
            .map((n: ASTNode<T, N>) => '    ' + this.parent.visit(n) + ";")
            .join('\n');

        const asyncPrefix = node.metadata.isAsync ? 'async ' : '';

        if (node.metadata.isConstructor) {
            return `constructor(${params}) {\n${body}\n  }`;
        }

        if (node.metadata.isMethod) {
            const isStatic = node.metadata.isStatic ? 'static ' : '';
            return `${isStatic}${asyncPrefix}${node.id}(${params}) {\n${body}\n  }`;
        }

        return `${asyncPrefix}function ${node.id}(${params}) {\n${body}\n}`;
    }
}