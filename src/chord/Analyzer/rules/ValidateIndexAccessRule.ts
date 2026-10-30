import { AnalysisRule } from "../AnalysisRule";
import { TypeInferrer } from "../TypeInferrer";
import { AccessNodeByIndex, ASTNode, BaseNode, LiteralNode, TokenType } from "../../model/types";
import { DataType, PrimitiveDataType, TupleDataType } from "../../model/DataType";

/**
 * Rejects the accesses by index that can never be valid:
 * - to a tuple (`par[5]`, read or written) whose literal index lies past its end: a tuple has a fixed
 *   length. An index that isn't a literal number is not checked, and neither is the access to a list,
 *   whose length isn't known.
 * - to a text (`t["x"]`, `t[1.5]`, `t[clave]` with `clave` a text) with an index that is not an
 *   integer: a text is indexed by position, and its length isn't checked. An index of unknown type is
 *   accepted. The position counts UTF-16 code units, as in JavaScript, so `t[1]` of `"a👍b"` is half
 *   of the emoji (see `Texto.caracteres` to index by character).
 *
 * Runs after every variable's type is resolved, walking the tree with the same scopes as the earlier
 * passes.
 */
export class ValidateIndexAccessRule<T extends string, N extends BaseNode<T>> extends AnalysisRule<T, N> {
    private readonly typeInferrer: TypeInferrer<T, N> = new TypeInferrer(this.context);

    /**
     * @override
     */
    check (nodes: ASTNode<T, N>[]): void {
        this.walkScoped(nodes, current => {
            if (current.type === TokenType.ACCESO_POR_INDICE) {
                const access = current as AccessNodeByIndex<T, N>;
                const receiverType = this.typeInferrer.infer(access.object);

                this.validateTupleIndex(access, receiverType);
                this.validateTextIndex(access, receiverType);
            }
        });
    }

    /**
     * @throws {DisChordError} If the receiver is a text and the index is a literal that is not an integer, or its known type is not `numero`.
     * @private
     */
    private validateTextIndex (access: AccessNodeByIndex<T, N>, receiverType: DataType | undefined): void {
        if (!(receiverType instanceof PrimitiveDataType && receiverType.name === PrimitiveDataType.Texto.name)) return;

        const literal = access.index.type === TokenType.LITERAL ? (access.index as LiteralNode<T>).value : undefined;
        const invalid = literal !== undefined
            ? typeof literal !== 'number' || !Number.isInteger(literal)
            : this.isKnownNonNumber(access);

        if (invalid) this.failAt(access, `El índice de un texto debe ser un número entero`);
    }

    /**
     * @returns {boolean} Whether the index of the access has a known type other than `numero`.
     * @private
     */
    private isKnownNonNumber (access: AccessNodeByIndex<T, N>): boolean {
        const indexType = this.typeInferrer.infer(access.index);

        return indexType !== undefined && !PrimitiveDataType.Numero.isAssignableFrom(indexType);
    }

    /**
     * @throws {DisChordError} If the index is a literal number at or past the end of the tuple.
     * @private
     */
    private validateTupleIndex (access: AccessNodeByIndex<T, N>, receiverType: DataType | undefined): void {
        if (access.index.type !== TokenType.LITERAL) return;

        const position = (access.index as LiteralNode<T>).value;
        if (typeof position !== 'number' || !Number.isInteger(position)) return;

        if (!(receiverType instanceof TupleDataType) || position < receiverType.elements.length) return;

        const length = receiverType.elements.length;

        this.failAt(access, `El índice ${position} está fuera de rango: la tupla tiene ${length} elemento(s) (índices del 0 al ${length - 1})`);
    }
}
