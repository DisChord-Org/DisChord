import { AnalysisRule } from "../AnalysisRule";
import { walkAST } from "../walkAST";
import { TypeInferrer } from "../TypeInferrer";
import { ASTNode, AccessNode, BaseNode, CallNode, ClassNode, FunctionNode, TokenType } from "../../types";
import { isAccessNode, isIdentificatorNode } from "../../ast.guards";
import { UserClassDataType } from "../../DataType";
import { asyncRuntimeHelperNames, corelib, coreLibUtils } from "../../corelib";
import { CompilerMetadataKind } from "../../types";
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
 * parents; a receiver of any other known type (core library classes, primitives, lists) never
 * awaits. A receiver of unknown type awaits only if every class of the file declaring a method of
 * that name marks it async, and at least one does.
 *
 * Runs after every variable's type is resolved, walking the tree with the same scopes as the
 * earlier passes.
 */
export class ResolveAwaitedCallsRule<T extends string, N extends BaseNode<T>> extends AnalysisRule<T, N> {
    private readonly typeInferrer: TypeInferrer<T, N> = new TypeInferrer(this.context);

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

        if (this.callers.length > 0 && !this.callers[this.callers.length - 1]) throw new ChordError({
            phase: ErrorLevel.Analysis,
            message: `Se llama a la función asíncrona '${name}' desde una función que no es asíncrona; márcala con @asincrono`,
            location: call.location
        }).format();

        this.context.symbolTable.markAwaited(call);
    }

    /**
     * Whether `access` names an async method, from what its receiver is.
     */
    private isAsyncMethod (access: AccessNode<T, N>): boolean {
        const symbolTable = this.context.symbolTable;
        const receiver = access.object;
        const currentClass = symbolTable.getMetadata<string>(CompilerMetadataKind.CurrentClass);

        if (receiver.type === TokenType.Esta) {
            return currentClass !== undefined && !!symbolTable.findMember(currentClass, access.property)?.metadata.isAsync;
        }

        if (receiver.type === TokenType.Super) {
            const parent = currentClass === undefined ? undefined : symbolTable.superClassOf(currentClass);
            return parent !== undefined && !!symbolTable.findMember(parent, access.property)?.metadata.isAsync;
        }

        if (isIdentificatorNode(receiver)) {
            if (symbolTable.isUserClass(receiver.value)) return !!symbolTable.findMember(receiver.value, access.property)?.metadata.isAsync;
            if (Object.prototype.hasOwnProperty.call(corelib.classes, receiver.value) && !symbolTable.lookup(receiver.value)) return false;
        }

        const type = this.typeInferrer.infer(receiver);
        if (type instanceof UserClassDataType) return !!symbolTable.findMember(type.name, access.property)?.metadata.isAsync;
        if (type) return false;

        const candidates = symbolTable.membersNamed(access.property);
        return candidates.length > 0 && candidates.every(symbol => symbol.metadata.isAsync);
    }
}
