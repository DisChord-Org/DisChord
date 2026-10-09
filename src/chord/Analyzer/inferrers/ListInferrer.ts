import { ASTNode, BaseNode, ListNode, TokenType, TokenTypeUnion } from "../../types";
import { ArrayDataType, ClassDataType, DataType, PrimitiveDataType, UnionDataType, UserClassDataType } from "../../model/DataType";
import { SubInferrer } from "../SubInferrer";

/**
 * Infers a list literal's array type: every element is inferred recursively via
 * `this.parent.infer` (an element can itself be an identifier, a binary expression, ...), and
 * their types are unioned together (`[1, "dos"]` -> `(numero|texto)[]`, not just `numero[]` or a
 * refusal to infer at all; `[nuevo B(), nuevo A()]` -> `(A|B)[]`). Only primitives and instances of
 * classes (of the file or of the core library), or unions of them, are unioned. Infers `undefined`
 * for an empty list, one with any non-inferrable element, or one with a nested list/tuple element (an
 * array's inferred type is always a flat union — a tuple type is only ever produced by an explicit
 * `tipo [...]` annotation, never inferred, matching how TypeScript itself never infers a tuple type
 * from a plain array literal either). The same goes for an element that is `cualquiera` or `nada`.
 */
export class ListInferrer<T extends string, N extends BaseNode<T>> extends SubInferrer<T, N> {
    public static triggerToken: TokenTypeUnion<TokenType> | undefined = TokenType.LISTA;

    public infer (node: ASTNode<T, N>): DataType | undefined {
        const listNode = node as ListNode<T, N>;
        if (listNode.body.length === 0) return undefined;

        const elementTypes = listNode.body.map(element => this.parent.infer(element));
        if (elementTypes.some(elementType => elementType === undefined)) return undefined;

        const isUnionable = (type: DataType): boolean => type instanceof PrimitiveDataType || type instanceof UserClassDataType || type instanceof ClassDataType;

        const unionable = (elementTypes as DataType[]).every(type => type instanceof UnionDataType ? type.members.every(isUnionable) : isUnionable(type));
        if (!unionable) return undefined;

        return ArrayDataType.of(UnionDataType.ofTypes(elementTypes as DataType[]));
    }
}
