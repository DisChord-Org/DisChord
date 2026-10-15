import { AnalysisRule } from "../AnalysisRule";
import { TypeInferrer } from "../TypeInferrer";
import { ASTNode, BaseNode, ExpressionNode, PrimitiveType, TokenType } from "../../model/types";
import { PrimitiveDataType } from "../../model/DataType";

/**
 * Marks the expressions of an interpolated text (`"activo: {activo}"`) whose type is `booleano`, so
 * the generator emits them as `verdadero`/`falso` — the words of the language — and not as the
 * `true`/`false` that JavaScript's `+` would give. The analyzer decides, the generator translates.
 *
 * Only a value known to be a `booleano` is marked: one of unknown or union type is left as it is.
 *
 * Runs after every variable's type is resolved, walking the tree with the same scopes as the earlier
 * passes.
 */
export class MarkInterpolatedBooleansRule<T extends string, N extends BaseNode<T>> extends AnalysisRule<T, N> {
    private readonly typeInferrer: TypeInferrer<T, N> = new TypeInferrer(this.context);

    /**
     * @override
     */
    check (nodes: ASTNode<T, N>[]): void {
        this.walkScoped(nodes, current => {
            if (current.type !== TokenType.EXPRESION || !(current as ExpressionNode<T, N>).interpolated) return;

            const type = this.typeInferrer.infer((current as ExpressionNode<T, N>).object);

            if (type instanceof PrimitiveDataType && type.name === PrimitiveType.Booleano) {
                this.context.symbolTable.marks.markBoolean(current);
            }
        });
    }
}
