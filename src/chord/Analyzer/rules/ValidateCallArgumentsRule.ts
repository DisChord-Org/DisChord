import { AnalysisRule } from "../AnalysisRule";
import { TypeInferrer } from "../TypeInferrer";
import { UserMemberResolver } from "../UserMemberResolver";
import { ASTNode, BaseNode, CallNode, CompilerMetadataKind, Symbol, SymbolKind, TokenType } from "../../types";
import { isAccessNode, isIdentificatorNode } from "../../ast.guards";
import { PrimitiveDataType } from "../../model/DataType";
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
 * constructor, or the nearest one it inherits, and `super(...)` against the constructor of the
 * parent class (also inherited if needed).
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
        this.walkScoped(nodes, current => this.enter(current));
    }

    private enter (node: ASTNode<T, N>): void {
        if (node.type === TokenType.LLAMADA) this.validate(node as CallNode<T, N>);
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

            const constructor = symbol?.kind === SymbolKind.Class ? this.constructorOf(callee.value) : undefined;
            return constructor ? { symbol: constructor, name: callee.value } : undefined;
        }

        if (callee.type === TokenType.Super) {
            const currentClass = symbolTable.getMetadata<string>(CompilerMetadataKind.CurrentClass);
            const parent = currentClass === undefined ? undefined : symbolTable.classes.superClassOf(currentClass);
            const constructor = parent === undefined ? undefined : this.constructorOf(parent);

            return constructor && parent !== undefined ? { symbol: constructor, name: parent } : undefined;
        }

        if (!isAccessNode(callee)) return undefined;

        const symbol = this.members.resolve(callee, this.typeInferrer.infer(callee.object));
        return symbol?.kind === SymbolKind.Function ? { symbol, name: callee.property } : undefined;
    }

    /**
     * The constructor `nuevo` runs for a class: its own, or else the nearest one up its chain of
     * parents. A parent that isn't a class of the file ends the search, and a cycle in the chain
     * is cut, so a broken hierarchy leaves the call unchecked instead of hanging.
     * @param {string} className - A class of the file.
     * @returns {Symbol | undefined} The constructor, or `undefined` if no class of the chain declares one.
     */
    private constructorOf (className: string): Symbol | undefined {
        const symbolTable = this.context.symbolTable;
        const seen = new Set<string>();
        let current: string | undefined = className;

        while (current !== undefined && !seen.has(current) && symbolTable.classes.isUserClass(current)) {
            seen.add(current);

            const own = symbolTable.classes.findMember(current, current);
            if (own?.kind === SymbolKind.Function) return own;

            current = symbolTable.classes.superClassOf(current);
        }

        return undefined;
    }

    private fail (message: string, node: ASTNode<T, N>): never {
        throw new ChordError({ phase: ErrorLevel.Analysis, message, location: node.location }).format();
    }
}
