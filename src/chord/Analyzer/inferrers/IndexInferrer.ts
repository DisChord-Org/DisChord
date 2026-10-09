import { ASTNode, AccessNodeByIndex, BaseNode, LiteralNode, TokenType, TokenTypeUnion } from "../../types";
import { ArrayDataType, DataType, PrimitiveDataType, TupleDataType } from "../../model/DataType";
import { PrimitiveType } from "../../types";
import { SubInferrer } from "../SubInferrer";

/**
 * Infers the type of an access by index (`l[0]`) from the type of what is indexed: the element type
 * of a list, the type at that position of a tuple when the index is a literal number, and `texto`
 * for a text. A tuple with a computed or out-of-range index, a union, `cualquiera` and a receiver
 * of unknown type infer `undefined`. A list index past its end is `indefinido` when it runs, which
 * isn't modelled (TypeScript doesn't either), and neither is a change to an element.
 */
export class IndexInferrer<T extends string, N extends BaseNode<T>> extends SubInferrer<T, N> {
    public static triggerToken: TokenTypeUnion<TokenType> | undefined = TokenType.ACCESO_POR_INDICE;

    public infer (node: ASTNode<T, N>): DataType | undefined {
        const access = node as AccessNodeByIndex<T, N>;
        const receiverType = this.parent.infer(access.object);

        if (receiverType instanceof ArrayDataType) return receiverType.element;
        if (receiverType instanceof TupleDataType) return this.elementAt(receiverType, access.index);
        if (receiverType instanceof PrimitiveDataType && receiverType.name === PrimitiveType.Texto) return PrimitiveDataType.Texto;

        return undefined;
    }

    /**
     * @returns The type at the position `index` names in `tuple`, if it is a literal number inside it.
     * @private
     */
    private elementAt (tuple: TupleDataType, index: ASTNode<T, N>): DataType | undefined {
        if (index.type !== TokenType.LITERAL) return undefined;

        const position = (index as LiteralNode<T>).value;
        return typeof position === 'number' && Number.isInteger(position) ? tuple.elements[position] : undefined;
    }
}
