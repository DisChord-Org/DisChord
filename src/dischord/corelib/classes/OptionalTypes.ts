import { DataType, UnionDataType } from "../../../chord/model/DataType";
import { PrimitiveType, PrimitiveTypeName } from "../../../chord/model/types";

/**
 * The types of the members of a core library class that may be absent.
 */
export class OptionalTypes {
    /**
     * @param {PrimitiveTypeName} kind - A primitive type.
     * @returns {DataType} That type or `indefinido`: the type of a member that may be absent.
     */
    public static of (kind: PrimitiveTypeName): DataType {
        return UnionDataType.of([ kind, PrimitiveType.Indefinido ]);
    }
}
