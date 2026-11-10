import { AnalysisRule } from "../AnalysisRule";
import { ASTNode, BaseNode, CallNode, ExpressionNode, ReturnNode, TokenType } from "../../model/types";
import { isAccessNode, isIdentificatorNode } from "../../ast.guards";
import { VoidDataType } from "../../model/DataType";

/**
 * A call that returns no value (`nada`: `consola.imprimir(...)`, a function without `devolver`) has nothing to
 * be used as, so it can only stand as a statement: a direct child of the body of a block (a function, a loop,
 * a branch of a condition, a command...) or of the file, or the operand of a `devolver`. Anywhere else (an
 * argument, an element of a list, an operand, a condition, the value of an assignment, a `{}` of an
 * interpolated text...) it is an error, since the JavaScript would be `undefined` flowing into the program.
 * Initializing a variable with one is rejected earlier, by `ResolveVariableTypesRule`.
 *
 * A call whose type is not known is not checked. Awaiting needs no case of its own: the await of a call to
 * an async function is part of the call, so the call stays a statement.
 *
 * Runs after every variable's type is resolved, walking the tree with the same scopes as the earlier passes.
 */
export class ValidateNoValueUsesRule<T extends string, N extends BaseNode<T>> extends AnalysisRule<T, N> {
    /** The keys of a node that hold a sequence of statements. */
    private static readonly StatementLists: readonly string[] = ['body', 'consequent', 'alternate'];

    /** What the parent of a call makes of it, by the type of the parent, for the message. */
    private static readonly Uses: Readonly<Record<string, string>> = {
        [TokenType.LLAMADA]: 'argumento',
        [TokenType.LISTA]: 'elemento de lista',
        [TokenType.EXPRESION_BINARIA]: 'operando',
        [TokenType.UNARIO]: 'operando',
        [TokenType.NO_UNARIO]: 'operando',
        [TokenType.CONDICION]: 'condición',
        [TokenType.ASIGNACION]: 'valor de una asignación',
        [TokenType.ACCESO_POR_INDICE]: 'índice u objeto de un acceso',
        [TokenType.ACCESO]: 'objeto de un acceso',
        [TokenType.BDO]: 'valor de un bloque',
        [TokenType.Nuevo]: 'argumento',
        [TokenType.EXPRESION]: 'operando'
    };

    /** The nodes that may stand as a statement: the children of a body, the file and the operand of a `devolver`. */
    private readonly statements: WeakSet<object> = new WeakSet();

    /** The nodes being visited, outermost first, the one in hand last. */
    private readonly path: ASTNode<T, N>[] = [];

    /**
     * @override
     */
    check (nodes: ASTNode<T, N>[]): void {
        nodes.forEach(node => this.statements.add(node));

        this.walkScoped(nodes, current => {
            this.path.push(current);
            this.markStatements(current);

            if (current.type === TokenType.LLAMADA) this.validate(current as CallNode<T, N>);
        }, () => {
            this.path.pop();
        });
    }

    /**
     * Remembers the children of `node` that are statements, since the walk reaches them after it.
     * @private
     */
    private markStatements (node: ASTNode<T, N>): void {
        if (node.type === TokenType.LISTA) return;

        const fields = node as unknown as Record<string, unknown>;

        ValidateNoValueUsesRule.StatementLists.forEach(key => {
            const list = fields[key];
            if (Array.isArray(list)) list.forEach(child => this.statements.add(child));
        });

        if (node.type === TokenType.Devolver) {
            const operand = (node as ReturnNode<T, N>).object;
            if (operand) this.statements.add(operand);
        }
    }

    /**
     * @throws {DisChordError} If the call returns no value and is not a statement.
     * @private
     */
    private validate (call: CallNode<T, N>): void {
        if (this.statements.has(call) || !(this.inferrer.infer(call) instanceof VoidDataType)) return;

        const parent = this.path[this.path.length - 2];
        const interpolated = parent?.type === TokenType.EXPRESION && (parent as ExpressionNode<T, N>).interpolated;
        const use = interpolated ? 'parte de un texto' : (parent && ValidateNoValueUsesRule.Uses[parent.type]) ?? 'valor';

        this.fail(`'${ValidateNoValueUsesRule.nameOf(call)}' no devuelve ningún valor, no se puede usar como ${use}`, call);
    }

    private static nameOf<T extends string, N extends BaseNode<T>> (call: CallNode<T, N>): string {
        const callee = call.object;

        if (isIdentificatorNode(callee)) return callee.value;

        return isAccessNode(callee) ? callee.property : 'la llamada';
    }
}
