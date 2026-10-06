import { AnalysisRule } from "../AnalysisRule";
import { walkAST } from "../walkAST";
import { TypeInferrer } from "../TypeInferrer";
import { UserMemberResolver } from "../UserMemberResolver";
import { ASTNode, BaseNode, CallNode, Symbol, SymbolKind, TokenType } from "../../types";
import { isAccessNode, isIdentificatorNode } from "../../ast.guards";
import { PrimitiveDataType } from "../../DataType";
import { PrimitiveType } from "../../types";
import { ChordError, ErrorLevel } from "../../../errors/ChordError";

/**
 * Checks the arguments of a call against the signature of the function, method or constructor it
 * resolves to in the file, but only for one that declares some type (an annotated parameter or a
 * return type): a function with no annotation at all accepts any arguments, as the language
 * always has.
 *
 * Each argument must be assignable to its parameter's type; a parameter without a type, and an
 * argument of unknown type or `cualquiera`, are never rejected. The argument count must match the
 * parameter count, except that a missing argument is fine for a parameter without a type or whose
 * type admits `indefinido`. A call to a class (`nuevo Caja(...)`) is checked against its
 * constructor.
 *
 * Walks the tree with the same scopes as the earlier passes, so the types of the locals passed as
 * arguments are resolved.
 */
export class ValidateCallArgumentsRule<T extends string, N extends BaseNode<T>> extends AnalysisRule<T, N> {
    private readonly typeInferrer: TypeInferrer<T, N> = new TypeInferrer(this.context);
    private readonly members: UserMemberResolver<T> = new UserMemberResolver(this.context);

    /**
     * @override
     */
    check (nodes: ASTNode<T, N>[]): void {
        nodes.forEach(node => walkAST<T, N>(node, current => this.enter(current), current => this.exit(current)));
    }

    private enter (node: ASTNode<T, N>): void {
        if (this.context.symbolTable.ownsScope(node)) this.context.symbolTable.enterScope(node);
        if (node.type === TokenType.LLAMADA) this.validate(node as CallNode<T, N>);
    }

    private exit (node: ASTNode<T, N>): void {
        if (this.context.symbolTable.ownsScope(node)) this.context.symbolTable.exitScope();
    }

    /**
     * Resolves the callee of `call` to a declaration with a signature and checks the arguments.
     * @throws {ChordError} If an argument's type or the argument count contradicts the signature.
     */
    private validate (call: CallNode<T, N>): void {
        const resolved = this.resolve(call);
        const signature = resolved?.symbol.signature;
        if (!resolved || !signature) return;

        const isAnnotated = signature.returns !== undefined || signature.params.some(type => type !== undefined);
        if (!isAnnotated) return;

        const { name } = resolved;
        const expected = signature.params.length;

        call.params.forEach((argument, index) => {
            const parameterType = signature.params[index];
            const argumentType = this.typeInferrer.infer(argument);

            if (parameterType && argumentType && !parameterType.isAssignableFrom(argumentType)) this.fail(
                `El argumento ${index + 1} de '${name}' es de tipo '${argumentType.format()}', se esperaba '${parameterType.format()}'`,
                argument
            );
        });

        const missing = signature.params.slice(call.params.length).some(type => type && !type.isAssignableFrom(PrimitiveDataType.of(PrimitiveType.Indefinido)));

        if (call.params.length > expected || missing) this.fail(
            `'${name}' espera ${expected} argumento(s) pero se le pasaron ${call.params.length}`,
            call
        );
    }

    /**
     * @returns The declaration `call` targets and the name to show for it, or `undefined` if it
     * isn't a function, method or class declared in the file.
     */
    private resolve (call: CallNode<T, N>): { symbol: Symbol; name: string } | undefined {
        const callee = call.object;
        const symbolTable = this.context.symbolTable;

        if (isIdentificatorNode(callee)) {
            const symbol = symbolTable.lookup(callee.value);

            if (symbol?.kind === SymbolKind.Function) return { symbol, name: callee.value };

            const constructor = symbol?.kind === SymbolKind.Class ? symbolTable.findMember(callee.value, callee.value) : undefined;
            return constructor ? { symbol: constructor, name: callee.value } : undefined;
        }

        if (!isAccessNode(callee)) return undefined;

        const symbol = this.members.resolve(callee, this.typeInferrer.infer(callee.object));
        return symbol?.kind === SymbolKind.Function ? { symbol, name: callee.property } : undefined;
    }

    private fail (message: string, node: ASTNode<T, N>): never {
        throw new ChordError({ phase: ErrorLevel.Analysis, message, location: node.location }).format();
    }
}
