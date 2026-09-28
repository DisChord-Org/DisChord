import { AnalysisRule } from "../AnalysisRule";
import { walkAST } from "../walkAST";
import { AssignmentNode, ASTNode, BaseNode, IdentificatorNode, TokenType } from "../../types";
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
 * Only checks a simple `identificador es <expr>` target — a property or index assignment
 * (`objeto.propiedad es x`, `lista[0] es x`) has no tracked `dataType` to check against, so it's
 * silently left alone, same as any other currently-untyped target.
 */
export class ValidateAssignmentTypesRule<T extends string, N extends BaseNode<T>> extends AnalysisRule<T, N> {
    /**
     * Delegate for inferring a `DataType` from the assigned expression — see `TypeInferrer`.
     * @private
     * @readonly
     */
    private readonly typeInferrer: TypeInferrer<T, N> = new TypeInferrer(this.context);

    /**
     * @override
     */
    check (nodes: ASTNode<T, N>[]): void {
        nodes.forEach(node => walkAST<T, N>(node, current => this.enter(current), current => this.exit(current)));
    }

    /**
     * Mirrors `ResolveVariableTypesRule`'s scope tracking (push on class/function entry) so a
     * reassignment inside a nested scope resolves its target against the same `SymbolTable` entry
     * earlier passes created for it.
     * @private
     */
    private enter (node: ASTNode<T, N>): void {
        switch (node.type) {
            case TokenType.Clase:
            case TokenType.Funcion:
                this.context.symbolTable.pushScope();
                break;

            case TokenType.ASIGNACION:
                this.validateAssignment(node as AssignmentNode<T, N>);
                break;
        }
    }

    /**
     * Mirrors `ResolveVariableTypesRule`'s scope tracking (pop on class/function exit).
     * @private
     */
    private exit (node: ASTNode<T, N>): void {
        if (node.type === TokenType.Clase || node.type === TokenType.Funcion) {
            this.context.symbolTable.popScope();
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
        if (node.left.type !== TokenType.IDENTIFICADOR) return;

        const name = (node.left as IdentificatorNode<T>).value;
        const declaredType = this.context.symbolTable.lookup(name)?.dataType;
        if (!declaredType) return;

        const assignedType = this.typeInferrer.infer(node.assignment);
        if (!assignedType) return;

        if (!declaredType.isAssignableFrom(assignedType)) throw new ChordError({
            phase: ErrorLevel.Analysis,
            message: `La variable '${name}' es de tipo '${declaredType.format()}' pero se le asignó un valor de tipo '${assignedType.format()}'`,
            location: node.location
        }).format();
    }
}
