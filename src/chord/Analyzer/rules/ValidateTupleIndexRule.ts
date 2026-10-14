import { AnalysisRule } from "../AnalysisRule";
import { TypeInferrer } from "../TypeInferrer";
import { AccessNodeByIndex, ASTNode, BaseNode, LiteralNode, TokenType } from "../../types";
import { TupleDataType } from "../../model/DataType";
import { ChordError, ErrorLevel } from "../../../errors/ChordError";

/**
 * Rejects an access by index to a tuple (`par[5]`, read or written) whose literal index lies past its
 * end: a tuple has a fixed length, so that is never a valid position. An index that isn't a literal
 * number is not checked, and neither is the access to a list, whose length isn't known.
 *
 * Runs after every variable's type is resolved, walking the tree with the same scopes as the earlier
 * passes.
 */
export class ValidateTupleIndexRule<T extends string, N extends BaseNode<T>> extends AnalysisRule<T, N> {
    private readonly typeInferrer: TypeInferrer<T, N> = new TypeInferrer(this.context);

    /**
     * @override
     */
    check (nodes: ASTNode<T, N>[]): void {
        this.walkScoped(nodes, current => {
            if (current.type === TokenType.ACCESO_POR_INDICE) this.validate(current as AccessNodeByIndex<T, N>);
        });
    }

    /**
     * @throws {ChordError} If the index is a literal number at or past the end of the tuple.
     * @private
     */
    private validate (access: AccessNodeByIndex<T, N>): void {
        if (access.index.type !== TokenType.LITERAL) return;

        const position = (access.index as LiteralNode<T>).value;
        if (typeof position !== 'number' || !Number.isInteger(position)) return;

        const receiverType = this.typeInferrer.infer(access.object);
        if (!(receiverType instanceof TupleDataType) || position < receiverType.elements.length) return;

        const length = receiverType.elements.length;

        throw new ChordError({
            phase: ErrorLevel.Analysis,
            message: `El índice ${position} está fuera de rango: la tupla tiene ${length} elemento(s) (índices del 0 al ${length - 1})`,
            location: access.location
        });
    }
}
