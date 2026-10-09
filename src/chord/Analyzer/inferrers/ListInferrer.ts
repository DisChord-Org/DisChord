import { ASTNode, BaseNode, ListNode, PrimitiveTypeName, TokenType, TokenTypeUnion } from "../../types";
import { ArrayDataType, DataType, PrimitiveDataType, UnionDataType } from "../../model/DataType";
import { SubInferrer } from "../SubInferrer";

/**
 * Infers a list literal's array type: every element is inferred recursively via
 * `this.parent.infer` (an element can itself be an identifier, a binary expression, ...), and
 * their primitive kinds are unioned together (`[1, "dos"]` -> `numero|texto[]`, not just
 * `numero[]` or a refusal to infer at all). Infers `undefined` for an empty list, one with any
 * non-inferrable element, or one with a nested list/tuple element (an array's inferred type is
 * always a flat union of primitives — a tuple type is only ever produced by an explicit
 * `tipo [...]` annotation, never inferred, matching how TypeScript itself never infers a tuple
 * type from a plain array literal either). The same goes for an element of any other type (an
 * instance of a class, `cualquiera`, `nada`, a union with such members): only primitives are unioned.
 */
export class ListInferrer<T extends string, N extends BaseNode<T>> extends SubInferrer<T, N> {
    public static triggerToken: TokenTypeUnion<TokenType> | undefined = TokenType.LISTA;

    public infer (node: ASTNode<T, N>): DataType | undefined {
        const listNode = node as ListNode<T, N>;
        if (listNode.body.length === 0) return undefined;

        const elementTypes = listNode.body.map(element => this.parent.infer(element));
        if (elementTypes.some(elementType => elementType === undefined)) return undefined;

        const kinds = new Set<PrimitiveTypeName>();
        const addKind = (type: DataType): boolean => {
            if (!(type instanceof PrimitiveDataType)) return false;
            kinds.add(type.name);
            return true;
        };

        for (const elementType of elementTypes as DataType[]) {
            const isPrimitiveOrUnionOfPrimitives = elementType instanceof UnionDataType
                ? elementType.members.every(addKind)
                : addKind(elementType);

            if (!isPrimitiveOrUnionOfPrimitives) return undefined;
        }

        return ArrayDataType.of(UnionDataType.of([ ...kinds ]));
    }
}
