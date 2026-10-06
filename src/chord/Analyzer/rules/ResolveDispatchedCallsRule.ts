import { AnalysisRule } from "../AnalysisRule";
import { walkAST } from "../walkAST";
import { TypeInferrer } from "../TypeInferrer";
import { ASTNode, BaseNode, CallNode } from "../../types";
import { isCallNode, isAccessNode } from "../../ast.guards";
import { UnionDataType } from "../../DataType";
import { coreLibUtils } from "../../corelib";

/**
 * Decides how a method called on a receiver of union type is emitted, and records the decision in
 * the `SymbolTable` for `CallVisitor` to read — the analyzer decides, the generator translates.
 * `c tipo texto|Mapa` doesn't say which class `c.tiene(x)` is a member of, so the call is either
 * emitted as the member every class of the union agrees on (`has`), or, when they differ, as a call
 * to a runtime helper that picks by what `c` really is when it runs (`chordTiene(c, x)`); see
 * `CoreLibUtils.resolveUnionDispatch` for the cases it leaves alone. Receivers of any other type are
 * not touched.
 *
 * Runs after every variable's type is resolved, walking the tree with the same scopes as the
 * earlier passes, and before `RequiresRuntimeHelpersRule`, which imports the helpers it picks.
 */
export class ResolveDispatchedCallsRule<T extends string, N extends BaseNode<T>> extends AnalysisRule<T, N> {
    private readonly typeInferrer: TypeInferrer<T, N> = new TypeInferrer(this.context);

    /**
     * @override
     */
    check (nodes: ASTNode<T, N>[]): void {
        nodes.forEach(node => walkAST<T, N>(node, current => this.enter(current), current => this.exit(current)));
    }

    private enter (node: ASTNode<T, N>): void {
        const symbolTable = this.context.symbolTable;

        if (symbolTable.ownsScope(node)) symbolTable.enterScope(node);
        if (isCallNode(node)) this.resolve(node);
    }

    private exit (node: ASTNode<T, N>): void {
        if (this.context.symbolTable.ownsScope(node)) this.context.symbolTable.exitScope();
    }

    private resolve (call: CallNode<T, N>): void {
        const callee = call.object;
        if (!isAccessNode(callee)) return;

        const receiverType = this.typeInferrer.infer(callee.object);
        if (!(receiverType instanceof UnionDataType)) return;

        const symbolTable = this.context.symbolTable;
        const dispatch = coreLibUtils.resolveUnionDispatch(callee, receiverType, className => !!symbolTable.findMember(className, callee.property));

        if (dispatch) symbolTable.markDispatched(call, dispatch);
    }
}
