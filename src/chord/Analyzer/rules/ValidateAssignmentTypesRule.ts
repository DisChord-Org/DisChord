import { AnalysisRule } from "../AnalysisRule";
import { AccessNodeByIndex, AssignmentNode, ASTNode, BaseNode, FunctionNode, LiteralNode, Symbol, TokenType, VariableNode } from "../../model/types";
import { isIdentificatorNode } from "../../ast.guards";
import { TypeInferrer } from "../TypeInferrer";
import { ChordError, ErrorLevel } from "../../../errors/ChordError";

/**
 * Validates that every reassignment (`x es <expr>`, an `ASIGNACION` node — not `var x tipo ... es
 * ...`, that's Pass 3's own concern) keeps the target variable's already-resolved `dataType`, the
 * same way `ResolveVariableTypesRule` already validates the declaration's own initializer. Runs
 * after Pass 3 (`ResolveVariableTypesRule`) rather than as part of it: it needs every variable's
 * `dataType` already resolved regardless of source order (a reassignment can appear before a
 * variable it references is declared further down only inside a function whose body runs later,
 * so it can't rely on "declared earlier in the same walk" the way Pass 3 itself can), not just a
 * lowering step independent of the binding model.
 *
 * A variable without an annotation whose reassignments change its type is already `cualquiera`
 * by then (see `ResolveVariableTypesRule`), so only the ones that keep it, and the annotated
 * ones, can be rejected here.
 *
 * Checks a simple `identificador es <expr>` target against the variable's type, and an index
 * assignment (`lista[0] es x`) against the type of that element when the list or tuple comes from a
 * variable or parameter declared with a type. A property assignment (`objeto.propiedad es x`) has no
 * tracked `dataType` to check against, so it's silently left alone, same as any other currently-untyped
 * target.
 */
export class ValidateAssignmentTypesRule<T extends string, N extends BaseNode<T>> extends AnalysisRule<T, N> {
    /**
     * Delegate for inferring a `DataType` from the assigned expression — see `TypeInferrer`.
     * @private
     * @readonly
     */
    private readonly typeInferrer: TypeInferrer<T, N> = new TypeInferrer(this.context);

    /**
     * The variables and parameters declared with a type. An element of a list or tuple is only checked
     * on assignment through one of these: one whose type was inferred stays free to change, as the
     * variable itself does.
     * @private
     * @readonly
     */
    private readonly annotated: Set<Symbol> = new Set();

    /**
     * @override
     */
    check (nodes: ASTNode<T, N>[]): void {
        this.walkScoped(nodes, current => this.collectAnnotated(current));
        this.walkScoped(nodes, current => this.enter(current));
    }

    /**
     * Records the symbol of a variable or parameter that was declared with a type, looked up with its
     * scope open.
     * @private
     */
    private collectAnnotated (node: ASTNode<T, N>): void {
        const symbolTable = this.context.symbolTable;

        if (node.type === TokenType.VARIABLE && (node as VariableNode<T, N>).dataType) {
            const symbol = symbolTable.lookup((node as VariableNode<T, N>).id);
            if (symbol) this.annotated.add(symbol);
        }

        if (node.type === TokenType.Funcion) {
            const fn = node as FunctionNode<T, N>;

            fn.params.forEach((param, index) => {
                const symbol = fn.paramTypes?.[index] ? symbolTable.lookup(param) : undefined;
                if (symbol) this.annotated.add(symbol);
            });
        }
    }

    /**
     * Validates each reassignment. `walkScoped` keeps the scope of the enclosing nodes entered, so a
     * reassignment inside a nested scope resolves its target against the same `SymbolTable` entry
     * earlier passes created for it.
     * @private
     */
    private enter (node: ASTNode<T, N>): void {
        switch (node.type) {
            case TokenType.ASIGNACION:
                this.validateAssignment(node as AssignmentNode<T, N>);
                break;
        }
    }

    /**
     * Checks one reassignment against its target's resolved `dataType`, if any. Silently does
     * nothing when the target isn't a plain identifier, the identifier has no resolved `dataType`
     * (an untyped variable, or one this compiler never learned the type of), or the assigned
     * expression itself isn't inferrable — the same "nothing to check against" cases
     * `ResolveVariableTypesRule.resolveDataType` already leaves alone for a declaration.
     * @private
     * @throws {ChordError} If the assigned expression's inferred type isn't assignable to the
     * target's resolved type.
     */
    private validateAssignment (node: AssignmentNode<T, N>): void {
        if (node.left.type === TokenType.ACCESO_POR_INDICE) {
            this.validateElementAssignment(node, node.left as AccessNodeByIndex<T, N>);
            return;
        }

        if (!isIdentificatorNode(node.left)) return;

        const declaredType = this.context.symbolTable.lookup(node.left.value)?.dataType;
        if (!declaredType) return;

        const assignedType = this.typeInferrer.infer(node.assignment);
        if (!assignedType) return;

        if (!declaredType.isAssignableFrom(assignedType)) throw new ChordError({
            phase: ErrorLevel.Analysis,
            message: `La variable '${node.left.value}' es de tipo '${declaredType.format()}' pero se le asignó un valor de tipo '${assignedType.format()}'`,
            location: node.location
        });
    }

    /**
     * Checks an assignment to an element (`notas[0] es "x"`) against the type of that element, when it
     * comes from a variable or parameter declared with a type: the element type of its list or the type
     * at that position of its tuple. A list whose type was inferred is left alone.
     * @private
     * @throws {ChordError} If the assigned value's type isn't assignable to the element's.
     */
    private validateElementAssignment (node: AssignmentNode<T, N>, target: AccessNodeByIndex<T, N>): void {
        let root: ASTNode<T, N> = target;
        while (root.type === TokenType.ACCESO_POR_INDICE) root = (root as AccessNodeByIndex<T, N>).object;

        const symbol = isIdentificatorNode(root) ? this.context.symbolTable.lookup(root.value) : undefined;
        if (!symbol || !this.annotated.has(symbol)) return;

        const elementType = this.typeInferrer.infer(target);
        const assignedType = elementType ? this.typeInferrer.infer(node.assignment) : undefined;
        if (!elementType || !assignedType) return;

        if (!elementType.isAssignableFrom(assignedType)) throw new ChordError({
            phase: ErrorLevel.Analysis,
            message: `La variable '${this.describe(target)}' es de tipo '${elementType.format()}' pero se le asignó un valor de tipo '${assignedType.format()}'`,
            location: node.location
        });
    }

    /**
     * @returns The target as written, `notas[0]`; an index that isn't a literal is shown as `…`.
     * @private
     */
    private describe (target: ASTNode<T, N>): string {
        if (target.type !== TokenType.ACCESO_POR_INDICE) return isIdentificatorNode(target) ? target.value : '…';

        const access = target as AccessNodeByIndex<T, N>;
        const index = access.index.type === TokenType.LITERAL ? (access.index as LiteralNode<T>).raw : '…';

        return `${this.describe(access.object)}[${index}]`;
    }
}
