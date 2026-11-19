import { AnalysisRule } from "../AnalysisRule";
import { ASTNode, BaseNode, CallNode, LoopNode, SyntaxFunction, TokenType } from "../../model/types";
import { isRangeCall } from "../../ast.guards";

/**
 * `rango` is not a function: it is the syntax a `para` turns into a counted loop (see `LoopVisitor`), so it
 * only means something as what a `para` goes over, and with the end (`rango(5)`) or the start and the end
 * (`rango(1, 5)`). Rejects the rest, which would crash the generator or reach the JavaScript as a call to
 * a function that does not exist: `rango()`, `rango(1, 10, 2)` and `var r es rango(3)`.
 *
 * A file that declares its own `rango` may call it anywhere else; what a `para` goes over is still the
 * syntax, with its one or two arguments.
 *
 * Runs once every declaration is bound, walking the tree with the same scopes as the earlier passes.
 */
export class ValidateRangeCallsRule<T extends string, N extends BaseNode<T>> extends AnalysisRule<T, N> {
    /** The fewest and the most arguments of a `rango`: the end, or the start and the end. */
    private static readonly MinArguments = 1;
    private static readonly MaxArguments = 2;

    /** The calls that are what a `para` goes over, which the walk reaches after their loop. */
    private readonly iterables: WeakSet<object> = new WeakSet();

    /**
     * @override
     */
    check (nodes: ASTNode<T, N>[]): void {
        this.walkScoped(nodes, node => {
            if (node.type === TokenType.BUCLE) this.iterables.add((node as LoopNode<T, N>).iterable);

            if (isRangeCall(node)) this.validate(node);
        });
    }

    /**
     * @throws {DisChordError} If the call is not what a `para` goes over, or has other than one or two arguments.
     * @private
     */
    private validate (call: CallNode<T, N>): void {
        const name = SyntaxFunction.Rango;

        if (!this.iterables.has(call)) {
            if (this.context.symbolTable.lookup(name) !== undefined) return;

            this.fail(`'${name}' solo puede usarse como el recorrido de un 'para': para (i en ${name}(3)) { ... }. No es un valor que se pueda guardar o pasar`, call);
        }

        const count = call.params.length;

        if (count < ValidateRangeCallsRule.MinArguments || count > ValidateRangeCallsRule.MaxArguments) {
            this.fail(`'${name}' necesita uno o dos argumentos (el final, o el inicio y el final) y se ${count === 1 ? 'encontró' : 'encontraron'} ${count}`, call);
        }
    }
}
