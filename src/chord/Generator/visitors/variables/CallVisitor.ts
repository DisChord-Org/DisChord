import { AccessNode, CallNode, BaseNode, TokenType, TokenTypeUnion } from "../../../model/types";
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
        const marks = this.parent.context.symbolTable.marks;

        if (isAccessNode(node.object)) {
            const isAwaited = marks.awaited.has(node);

            const dispatch = marks.dispatches.get(node);
            if (dispatch) return this.visitDispatched(node.object, dispatch, args, isAwaited);

            return `${CallVisitor.awaitPrefix(isAwaited)}${this.parent.visit(node.object)}(${args})`;
        }

        if (isIdentificatorNode(node.object)) {
            const translation = this.parent.context.coreLib.resolveFunction(node.object, this.parent.context.symbolTable) ?? node.object.value;
            const isAsyncCall = asyncRuntimeHelperNames.has(translation) || marks.awaited.has(node);

            return `${CallVisitor.awaitPrefix(isAsyncCall)}${translation}(${args})`;
        }

        return `${this.parent.visit(node.object)}(${args})`;
    }

    /**
     * @returns {string} The keyword that makes the call wait for its result, if it must.
     * @private
     */
    private static awaitPrefix(isAsyncCall: boolean): string {
        return isAsyncCall ? 'await ' : '';
    }

    /**
     * Emits a call the Analyzer decided to dispatch (see `ResolveDispatchedCallsRule`): either the
     * member the classes of the receiver's union agree on, or a runtime helper taking the receiver as
     * its first argument.
     * @private
     */
    private visitDispatched(access: AccessNode<T, N>, dispatch: CallDispatch, args: string, isAsyncCall: boolean): string {
        const awaitPrefix = CallVisitor.awaitPrefix(isAsyncCall);
        const receiver = this.parent.visit(access.object);

        if ('member' in dispatch) return `${awaitPrefix}${receiver}.${dispatch.member}(${args})`;

        return `${awaitPrefix}${dispatch.helper}(${[ receiver, ...(args ? [ args ] : []) ].join(', ')})`;
    }
}