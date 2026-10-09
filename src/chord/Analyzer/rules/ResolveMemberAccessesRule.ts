import { AnalysisRule } from "../AnalysisRule";
import { TypeInferrer } from "../TypeInferrer";
import { ASTNode, AccessNode, AssignmentNode, BaseNode, CallNode, TokenType } from "../../types";
import { isAccessNode, isIdentificatorNode } from "../../ast.guards";
import { AnyDataType, DataType, UnionDataType } from "../../model/DataType";
import { ResolvedMember } from "../../corelib";
import { ChordError, ErrorLevel } from "../../../errors/ChordError";

/**
 * Decides the name every non-static member access is emitted with, and records it in the
 * `SymbolTable` for `AccessVisitor` to read — the analyzer decides, the generator translates.
 * The name is the JavaScript name of the core library member the access stands for (resolved
 * through the type of its receiver), or the name as written when it stands for none, when a class
 * of the file declares a member of that name on a receiver of unknown type, or when, on such a
 * receiver, the access is used as a field: a method not called, or a property assigned. What an
 * access is used as is told by its parent, which the walk visits first: the callee of a call, the
 * target of an assignment (only the outer access of `p.dia.mes es 3`), or otherwise a read. A static
 * core library access is left alone, except that an instance member reached through its class
 * (`Texto.limpiar`) is rejected, and so is a method read without calling it, or a property called, on a
 * receiver of known class.
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

        if (!isAccessNode(node)) return;

        const symbolTable = this.context.symbolTable;
        const staticMember = this.context.coreLib.resolveStatic(node);

        if (staticMember) {
            this.checkInstanceMemberOnClass(node, staticMember);
            return;
        }

        const receiverType = this.typeInferrer.infer(node.object);
        const declaredByUser = symbolTable.classes.hasMemberNamed(node.property);
        const resolved = this.context.coreLib.resolveInstanceMember(node, receiverType, declaredByUser);

        const role = this.callees.has(node) ? 'callee' : this.targets.has(node) ? 'assignment' : 'read';
        if (resolved && receiverType && !declaredByUser) this.checkUse(node, resolved, receiverType, role);
        const isUnknownReceiver = !receiverType || receiverType instanceof AnyDataType;
        const isFieldUse = resolved && isUnknownReceiver && (resolved.isProperty ? role !== 'read' : role !== 'callee');

        symbolTable.marks.markMember(node, resolved && !isFieldUse ? resolved.member.transpile : node.property);
    }

    /**
     * On a receiver whose class is known, a core library method must be called and a property must not
     * be: anything else would be emitted as JavaScript that doesn't do what was written (`f.dia` as the
     * function `f.getDate`, `t.longitud()` as a call of a number). A receiver of unknown type, a union
     * or `cualquiera` is not checked. A method assigned to is left as it was.
     * @throws {ChordError} If the member is used the wrong way.
     * @private
     */
    private checkUse (access: AccessNode<T, N>, resolved: ResolvedMember, receiverType: DataType, role: string): void {
        if (receiverType instanceof AnyDataType || receiverType instanceof UnionDataType) return;

        const className = resolved.qualifiedName.split('.')[0];

        if (!resolved.isProperty && role === 'read') this.fail(`'${access.property}' es un método de ${className}: llámalo con paréntesis, ${access.property}()`, access);
        if (resolved.isProperty && role === 'callee') this.fail(`'${access.property}' es una propiedad de ${className}, no un método`, access);
    }

    /**
     * An instance member of a core library class can't be reached through the class itself
     * (`Texto.limpiar`, `Mapa.tiene`): there is no instance for it to act on. A name the file declares
     * itself is not the class.
     * @throws {ChordError} If the member isn't static.
     * @private
     */
    private checkInstanceMemberOnClass (access: AccessNode<T, N>, member: ResolvedMember): void {
        if (member.member.static || (isIdentificatorNode(access.object) && this.context.symbolTable.lookup(access.object.value))) return;

        const className = member.qualifiedName.split('.')[0];
        const kind = member.isProperty ? 'una propiedad' : 'un método';

        this.fail(`'${access.property}' es ${kind} de instancia de ${className}, no se puede usar sobre la clase`, access);
    }

    private fail (message: string, node: ASTNode<T, N>): never {
        throw new ChordError({ phase: ErrorLevel.Analysis, message, location: node.location }).format();
    }
}
