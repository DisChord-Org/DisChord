import { AnalysisRule } from "../AnalysisRule";
import { TypeInferrer } from "../TypeInferrer";
import { ASTNode, BaseNode, FunctionNode, ReturnNode, TokenType } from "../../types";
import { isFunctionNode } from "../../ast.guards";
import { DataType, VoidDataType } from "../../model/DataType";
import { ChordError, ErrorLevel } from "../../../errors/ChordError";

/**
 * Checks every `devolver` of a function that declares its return type (`-> numero`) against it,
 * and that a function whose declared type doesn't admit `nada` returns something at all (any
 * `devolver` in its body counts: which paths reach it isn't analyzed). A value of unknown type
 * or `cualquiera` is always accepted. The innermost enclosing function is the one a `devolver`
 * belongs to; a function declaring no return type isn't checked, and neither is a constructor,
 * which can't declare one.
 *
 * Walks the tree with the same scopes as the earlier passes, so the locals a returned expression
 * uses have their types resolved.
 */
export class ValidateReturnTypesRule<T extends string, N extends BaseNode<T>> extends AnalysisRule<T, N> {
    private readonly typeInferrer: TypeInferrer<T, N> = new TypeInferrer(this.context);

    /**
     * The functions enclosing the node being visited (innermost last), each with whether a
     * `devolver` of its own has been seen.
     */
    private readonly functions: { node: FunctionNode<T, N>; returns: boolean }[] = [];

    /**
     * @override
     */
    check (nodes: ASTNode<T, N>[]): void {
        this.walkScoped(nodes, current => this.enter(current), current => this.exit(current));
    }

    private enter (node: ASTNode<T, N>): void {
        if (isFunctionNode(node)) this.functions.push({ node, returns: false });
        else if (node.type === TokenType.Devolver) this.validate(node as ReturnNode<T, N>);
    }

    private exit (node: ASTNode<T, N>): void {
        if (isFunctionNode(node)) {
            const frame = this.functions.pop()!;
            const declared = frame.node.returnType;

            if (declared && !frame.returns && !declared.isAssignableFrom(VoidDataType.Void)) this.fail(
                `La función '${frame.node.id}' declara retorno '${declared.format()}' pero no devuelve ningún valor`,
                frame.node
            );
        }
    }

    /**
     * Checks one `devolver` against the return type of the function it belongs to.
     * @throws {ChordError} If the returned value, or its absence, doesn't fit the declared type.
     */
    private validate (node: ReturnNode<T, N>): void {
        const frame = this.functions[this.functions.length - 1];
        if (!frame) return;

        frame.returns = true;

        const declared = frame.node.returnType;
        if (!declared) return;

        const name = frame.node.id;

        if (!node.object) {
            if (!declared.isAssignableFrom(VoidDataType.Void)) this.fail(
                `La función '${name}' declara retorno '${declared.format()}' pero 'devolver' no devuelve ningún valor`,
                node
            );
            return;
        }

        const valueType: DataType | undefined = this.typeInferrer.infer(node.object);

        if (valueType && !declared.isAssignableFrom(valueType)) this.fail(
            `La función '${name}' declara retorno '${declared.format()}' pero devuelve un valor de tipo '${valueType.format()}'`,
            node
        );
    }

    private fail (message: string, node: ASTNode<T, N>): never {
        throw new ChordError({ phase: ErrorLevel.Analysis, message, location: node.location }).format();
    }
}
