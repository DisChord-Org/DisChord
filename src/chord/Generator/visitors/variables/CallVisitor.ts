import { CallNode, BaseNode, TokenType, TokenTypeUnion, IdentificatorNode, AccessNode } from "../../../types";
import { SubGenerator } from "../../SubGenerator";

/**
 * Atomic SubGenerator that handles function and method execution structures.
 * Performs compile-time semantic lookups to automatically inject JavaScript 'await' modifiers.
 * @class CallVisitor
 * @extends {SubGenerator<T, N>}
 * @template {string} T - Extensible token type string vector.
 * @template {BaseNode<T>} N - Extensible abstract syntax tree node layout.
 */
export class CallVisitor<T extends string, N extends BaseNode<T>> extends SubGenerator<T, N> {
    /**
     * The node type string that triggers the activation of this specific sub-generator.
     * @public
     * @static
     */
    public static triggerToken: TokenTypeUnion<TokenType> | undefined = TokenType.LLAMADA;

    /**
     * Resolves routine execution nodes by evaluating arguments and looking up async signatures.
     * `node.object`'s shape (identifier, property access, or `super`) is guaranteed by the
     * Analyzer's `ValidateCallTargetsRule`, which runs before generation ever starts — this visitor
     * only has to translate, not validate.
     * @param {CallNode<T, N>} node - The target routine invocation syntax tree node.
     * @returns {string} The fully compiled JavaScript function call expression string.
     * @public
     */
    public visit(node: CallNode<T, N>): string {
        const args: string = node.params.map(arg => this.parent.visit(arg)).join(', ');
        let translation: string;
        let isAsyncCall = false;

        if (node.object.type === TokenType.ACCESO) {
            const accessNode = node.object as AccessNode<T, N>;
            translation = this.parent.visit(accessNode);

            const symbol = this.parent.context.symbolTable.lookup(accessNode.property);
            if (symbol?.metadata.isAsync) {
                isAsyncCall = true;
            }
        } else if (node.object.type === TokenType.IDENTIFICADOR) {
            const identificatorNode = node.object as IdentificatorNode<T>;
            const name = identificatorNode.value;
            translation = name;

            const symbol = this.parent.context.symbolTable.lookup(name);
            if (symbol?.metadata.isAsync) {
                isAsyncCall = true;
            }
        } else {
            translation = this.parent.visit(node.object);
        }

        const awaitPrefix = isAsyncCall ? 'await ' : '';
        return `${awaitPrefix}${translation}(${args})`;
    }
}