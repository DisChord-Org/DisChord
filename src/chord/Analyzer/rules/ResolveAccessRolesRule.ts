import { AnalysisRule } from "../AnalysisRule";
import { walkAST } from "../../walkAST";
import { ASTNode, AssignmentNode, BaseNode, CallNode, TokenType } from "../../types";
import { isAccessNode } from "../../ast.guards";

/**
 * Records, for every member access, whether it is the callee of a call (`p.partir(",")`) or the
 * target of an assignment (`p.longitud es 3`) — anything else is a plain read. The generator
 * reads the role to decide whether a core library name on a receiver of unknown type may be
 * rewritten: `p.dia` read as a field of an object is not the method `getDate`. For a compound
 * target (`p.dia.mes es 3`) only the outer access is the target; the inner one is read.
 */
export class ResolveAccessRolesRule<T extends string, N extends BaseNode<T>> extends AnalysisRule<T, N> {
    /**
     * @override
     */
    check (nodes: ASTNode<T, N>[]): void {
        nodes.forEach(node => walkAST<T, N>(node, current => this.mark(current)));
    }

    private mark (node: ASTNode<T, N>): void {
        if (node.type === TokenType.LLAMADA) {
            const callee = (node as CallNode<T, N>).object;
            if (isAccessNode(callee)) this.context.symbolTable.markCallee(callee);
        } else if (node.type === TokenType.ASIGNACION) {
            const target = (node as AssignmentNode<T, N>).left;
            if (isAccessNode(target)) this.context.symbolTable.markAssignmentTarget(target);
        }
    }
}
