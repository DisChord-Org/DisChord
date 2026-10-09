import { AccessNode, CallNode, BaseNode, TokenType, TokenTypeUnion } from "../../../types";
import { CallDispatch } from "../../../model/CompilationMarks";
import { isAccessNode, isIdentificatorNode } from "../../../ast.guards";
import { SubGenerator } from "../../SubGenerator";
import { asyncRuntimeHelperNames } from "../../../corelib";

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
     * Resolves routine execution nodes by evaluating arguments and reading the Analyzer's decision on whether to await the call.
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

        if (isAccessNode(node.object)) {
            isAsyncCall = this.parent.context.symbolTable.marks.isAwaited(node);

            const dispatch = this.parent.context.symbolTable.marks.dispatchOf(node);
            if (dispatch) return this.visitDispatched(node, node.object, dispatch, args, isAsyncCall);

            translation = this.parent.visit(node.object);
        } else if (isIdentificatorNode(node.object)) {
            const name = node.object.value;
            translation = this.parent.context.coreLib.resolveFunction(node.object, !!this.parent.context.symbolTable.lookup(name)) ?? name;
            isAsyncCall = asyncRuntimeHelperNames.has(translation);

            if (this.parent.context.symbolTable.marks.isAwaited(node)) {
                isAsyncCall = true;
            }
        } else {
            translation = this.parent.visit(node.object);
        }

        const awaitPrefix = isAsyncCall ? 'await ' : '';
        return `${awaitPrefix}${translation}(${args})`;
    }

    /**
     * Emits a call the Analyzer decided to dispatch (see `ResolveDispatchedCallsRule`): either the
     * member the classes of the receiver's union agree on, or a runtime helper taking the receiver as
     * its first argument.
     * @private
     */
    private visitDispatched(node: CallNode<T, N>, access: AccessNode<T, N>, dispatch: CallDispatch, args: string, isAsyncCall: boolean): string {
        const awaitPrefix = isAsyncCall ? 'await ' : '';
        const receiver = this.parent.visit(access.object);

        if ('member' in dispatch) return `${awaitPrefix}${receiver}.${dispatch.member}(${args})`;

        return `${awaitPrefix}${dispatch.helper}(${[ receiver, ...(args ? [ args ] : []) ].join(', ')})`;
    }
}