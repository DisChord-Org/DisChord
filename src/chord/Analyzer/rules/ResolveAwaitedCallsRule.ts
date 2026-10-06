import { AnalysisRule } from "../AnalysisRule";
import { walkAST } from "../walkAST";
import { TypeInferrer } from "../TypeInferrer";
import { UserMemberResolver } from "../UserMemberResolver";
import { ASTNode, AccessNode, BaseNode, CallNode, ClassNode, FunctionNode, TokenType } from "../../types";
import { isAccessNode, isIdentificatorNode } from "../../ast.guards";
import { AnyDataType, UnionDataType, UserClassDataType } from "../../DataType";
import { asyncRuntimeHelperNames, corelib, coreLibUtils } from "../../corelib";
import { ChordError, ErrorLevel } from "../../../errors/ChordError";

/**
 * Decides, for every call, whether the generated JavaScript must `await` it, and records the
 * decision in the `SymbolTable` for `CallVisitor` to read — the analyzer decides, the generator
 * translates. Also rejects calling an async function or method from a function that isn't async,
 * which would otherwise emit an `await` that is a JavaScript syntax error. The top level of a
 * file may await, and so may the body of anything the dialect registers as an async scope owner
 * (e.g. dischord's commands and events).
 *
 * A method called through an object is resolved by the type of its receiver: an instance of a
 * class of this file, `esta` (the enclosing class) or `super` are looked up in that class and its
 * parents; a core library class awaits the static members it marks `async` (`Promesa.todas`), and a
 * receiver of any other known type (primitives, lists, instances of core library classes) never
 * awaits. A receiver of a union type awaits if some class of the union declares the method and every
 * one that does marks it async. A receiver of unknown type (or `cualquiera`) awaits only if every class of the file declaring a method of
 * that name marks it async, and at least one does.
 *
 * Runs after every variable's type is resolved, walking the tree with the same scopes as the
 * earlier passes.
 */
export class ResolveAwaitedCallsRule<T extends string, N extends BaseNode<T>> extends AnalysisRule<T, N> {
    private readonly typeInferrer: TypeInferrer<T, N> = new TypeInferrer(this.context);
    private readonly members: UserMemberResolver<T> = new UserMemberResolver(this.context);

    /**
     * Whether each enclosing function-like body (innermost last) may `await`. Empty at the top level.
     */
    private readonly callers: boolean[] = [];

    /**
     * @override
     */
    check (nodes: ASTNode<T, N>[]): void {
        nodes.forEach(node => walkAST<T, N>(node, current => this.enter(current), current => this.exit(current)));
    }

    private enter (node: ASTNode<T, N>): void {
        const symbolTable = this.context.symbolTable;

        if (symbolTable.ownsScope(node)) {
            symbolTable.enterScope(node);

            if (node.type === TokenType.Funcion) this.callers.push(!!(node as FunctionNode<T, N>).metadata.isAsync);
            else if (node.type === TokenType.Clase) this.callers.push(false);
            else this.callers.push(symbolTable.hasAsyncBody(node));
        }

        if (node.type === TokenType.LLAMADA) this.resolve(node as CallNode<T, N>);

        const awaitingMessage = this.awaitingConstruct(node);
        if (awaitingMessage !== undefined) this.assertMayAwait(awaitingMessage, node.location);
    }

    /**
     * Hook for a dialect whose constructs, not being calls, are emitted with a fixed `await`
     * (dischord's `enviar mensaje`): the same rule applies to them as to an awaited call.
     * @param {ASTNode<T, N>} node - Any node of the tree.
     * @returns {string | undefined} The error to report if the node awaits and can't be used from a function that isn't async, or `undefined` if it doesn't await.
     * @protected
     */
    protected awaitingConstruct (node: ASTNode<T, N>): string | undefined {
        return undefined;
    }

    /**
     * @param {string} message - The error to report.
     * @param {BaseNode<T>['location']} location - Where.
     * @throws {ChordError} If the innermost enclosing function-like body can't `await`.
     * @private
     */
    private assertMayAwait (message: string, location: BaseNode<T>['location']): void {
        if (this.callers.length > 0 && !this.callers[this.callers.length - 1]) throw new ChordError({
            phase: ErrorLevel.Analysis,
            message,
            location
        }).format();
    }

    private exit (node: ASTNode<T, N>): void {
        if (this.context.symbolTable.ownsScope(node)) {
            this.callers.pop();
            this.context.symbolTable.exitScope();
        }
    }

    /**
     * Decides one call and, if it is awaited, checks that its caller may await.
     * @throws {ChordError} If an async function or method is called from a function that isn't async.
     */
    private resolve (call: CallNode<T, N>): void {
        const callee = call.object;
        let name: string;
        let awaited: boolean;

        if (isAccessNode(callee)) {
            name = callee.property;
            awaited = this.isAsyncMethod(callee);
        } else if (isIdentificatorNode(callee)) {
            name = callee.value;
            const helper = coreLibUtils.resolveFunction(callee);
            awaited = helper !== undefined
                ? asyncRuntimeHelperNames.has(helper)
                : !!this.context.symbolTable.lookup(name)?.metadata.isAsync;
        } else return;

        if (!awaited) return;

        this.assertMayAwait(`Se llama a la función asíncrona '${name}' desde una función que no es asíncrona; márcala con @asincrono`, call.location);

        this.context.symbolTable.markAwaited(call);
    }

    /**
     * Whether a method called on a receiver of a union type is async: the members that aren't
     * classes of this file (primitives, core library classes, lists) are ignored, and it is awaited if
     * at least one class of the union declares the method and every one that does marks it async.
     */
    private isAsyncOnUnion (union: UnionDataType, method: string): boolean {
        const declared = union.members
            .filter((member): member is UserClassDataType => member instanceof UserClassDataType)
            .map(member => this.context.symbolTable.findMember(member.name, method))
            .filter(symbol => symbol !== undefined);

        return declared.length > 0 && declared.every(symbol => symbol.metadata.isAsync);
    }

    /**
     * Whether `access` names an async method, from what its receiver is.
     */
    private isAsyncMethod (access: AccessNode<T, N>): boolean {
        const symbolTable = this.context.symbolTable;
        const receiver = access.object;

        // `esta`, `super` and a class of the file named directly are resolved without the receiver's type, and
        // never fall back to the checks below, even when the class or its parent is unknown.
        if (receiver.type === TokenType.Esta || receiver.type === TokenType.Super || (isIdentificatorNode(receiver) && symbolTable.isUserClass(receiver.value))) {
            return !!this.members.resolve(access)?.metadata.isAsync;
        }

        if (isIdentificatorNode(receiver)) {
            if (Object.prototype.hasOwnProperty.call(corelib.classes, receiver.value) && !symbolTable.lookup(receiver.value)) {
                return !!coreLibUtils.resolveStatic(access)?.member.async;
            }
        }

        const type = this.typeInferrer.infer(receiver);
        if (type instanceof UserClassDataType) return !!this.members.resolve(access, type)?.metadata.isAsync;
        if (type instanceof UnionDataType) return this.isAsyncOnUnion(type, access.property);
        if (type && !(type instanceof AnyDataType)) return false;

        const candidates = symbolTable.membersNamed(access.property);
        return candidates.length > 0 && candidates.every(symbol => symbol.metadata.isAsync);
    }
}
