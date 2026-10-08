import { AnalysisRule } from "../AnalysisRule";
import { TypeInferrer } from "../TypeInferrer";
import { ASTNode, AssignmentNode, BaseNode, CallNode, TokenType } from "../../types";
import { isAccessNode } from "../../ast.guards";
import { AnyDataType } from "../../DataType";
import { coreLibUtils } from "../../corelib";

/**
 * Decides the name every non-static member access is emitted with, and records it in the
 * `SymbolTable` for `AccessVisitor` to read — the analyzer decides, the generator translates.
 * The name is the JavaScript name of the core library member the access stands for (resolved
 * through the type of its receiver), or the name as written when it stands for none, when a class
 * of the file declares a member of that name on a receiver of unknown type, or when, on such a
 * receiver, the access is used as a field: a method not called, or a property assigned. What an
 * access is used as is told by its parent, which the walk visits first: the callee of a call, the
 * target of an assignment (only the outer access of `p.dia.mes es 3`), or otherwise a read. A static
 * core library access is left alone.
 *
 * Runs after every variable's type is resolved, walking the tree with the same scopes as the
 * earlier passes.
 */
export class ResolveMemberAccessesRule<T extends string, N extends BaseNode<T>> extends AnalysisRule<T, N> {
    private readonly typeInferrer: TypeInferrer<T, N> = new TypeInferrer(this.context);

    /**
     * Accesses seen as the callee of a call or as the target of an assignment, by the time the walk
     * reaches them.
     */
    private readonly callees: WeakSet<object> = new WeakSet();
    private readonly targets: WeakSet<object> = new WeakSet();

    /**
     * @override
     */
    check (nodes: ASTNode<T, N>[]): void {
        this.walkScoped(nodes, current => this.enter(current));
    }

    private enter (node: ASTNode<T, N>): void {
        if (node.type === TokenType.LLAMADA) {
            const callee = (node as CallNode<T, N>).object;
            if (isAccessNode(callee)) this.callees.add(callee);
        } else if (node.type === TokenType.ASIGNACION) {
            const target = (node as AssignmentNode<T, N>).left;
            if (isAccessNode(target)) this.targets.add(target);
        }

        if (!isAccessNode(node) || coreLibUtils.resolveStatic(node)) return;

        const symbolTable = this.context.symbolTable;
        const receiverType = this.typeInferrer.infer(node.object);
        const declaredByUser = symbolTable.hasMemberNamed(node.property);
        const resolved = coreLibUtils.resolveInstanceMember(node, receiverType, declaredByUser);

        const role = this.callees.has(node) ? 'callee' : this.targets.has(node) ? 'assignment' : 'read';
        const isUnknownReceiver = !receiverType || receiverType instanceof AnyDataType;
        const isFieldUse = resolved && isUnknownReceiver && (resolved.isProperty ? role !== 'read' : role !== 'callee');

        symbolTable.markMember(node, resolved && !isFieldUse ? resolved.member.transpile : node.property);
    }
}
