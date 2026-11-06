import { PrimitiveTypeName } from "../types";
import { DataTypeKind, DataType } from "./base";
import { PrimitiveDataType, AnyDataType } from "./simple";

/**
 * A union of two or more distinct types, e.g. `texto|numero` or `texto|Mapa|Caja`. Never holds a
 * single member, another union, or `cualquiera` — {@link UnionDataType.ofTypes} flattens, deduplicates
 * and collapses those cases, mirroring how TypeScript itself never represents a one-member union as a
 * `UnionType`. `nada` may be a member: it only makes sense as a return type, which `tipo` annotations
 * of a `var` or parameter reject separately (see `ValidateTypeAnnotationsRule`).
 */
export class UnionDataType extends DataType {
    public readonly kind = DataTypeKind.Union;
    public readonly members: DataType[];

    private constructor (members: DataType[]) {
        super();
        this.members = members;
    }

    /**
     * Builds the `DataType` for a set of one or more primitive kinds. See {@link ofTypes}.
     * @param {PrimitiveTypeName[]} kinds - The primitive kinds the type is a union of (always at
     * least one).
     * @returns {DataType} The resulting primitive or union type.
     */
    public static of (kinds: PrimitiveTypeName[]): DataType {
        return UnionDataType.ofTypes(kinds.map(PrimitiveDataType.of));
    }

    /**
     * Builds the `DataType` for a set of one or more types: nested unions are flattened, members
     * are deduplicated (by structure, keeping the order first encountered — order carries no meaning
     * for a union, see {@link isAssignableFrom}, but is kept stable for readable, deterministic
     * {@link format} output), a single distinct member collapses to that member, and any `cualquiera`
     * absorbs the rest (`cualquiera|texto` is `cualquiera`, since it is compatible with everything anyway).
     * @param {DataType[]} types - The types the result is a union of (always at least one).
     * @returns {DataType} The resulting type.
     */
    public static ofTypes (types: DataType[]): DataType {
        const flat = types.flatMap(type => type instanceof UnionDataType ? type.members : [ type ]);
        if (flat.some(type => type instanceof AnyDataType)) return AnyDataType.Any;

        const unique = new Map<string, DataType>();
        flat.forEach(type => {
            const key = `${type.kind}:${type.format()}`;
            if (!unique.has(key)) unique.set(key, type);
        });

        const members = [ ...unique.values() ];
        return members.length === 1 ? members[0] : new UnionDataType(members);
    }

    protected acceptsNonUnionSource (source: DataType): boolean {
        return this.members.some(member => member.isAssignableFrom(source));
    }

    /**
     * Members are sorted by their own text, and an array member is parenthesized (`numero|(texto[])`):
     * what is shown can be written back in a `tipo` annotation as is, where `numero|texto[]` would be
     * rejected as ambiguous.
     */
    public format (): string {
        return this.members
            .map(member => ({ text: member.format(), isArray: member instanceof ArrayDataType }))
            .sort((a, b) => (a.text < b.text ? -1 : a.text > b.text ? 1 : 0))
            .map(({ text, isArray }) => isArray ? `(${text})` : text)
            .join('|');
    }
}

/** A homogeneous array of some other `DataType` (its `element`), e.g. `texto[]` or
 * `(texto|numero)[]`. */
export class ArrayDataType extends DataType {
    public readonly kind = DataTypeKind.Array;
    public readonly element: DataType;

    private constructor (element: DataType) {
        super();
        this.element = element;
    }

    /** Shared `cualquiera[]` instance: a list whose element type isn't known. */
    public static readonly AnyList = new ArrayDataType(AnyDataType.Any);

    /** Builds a homogeneous array `DataType` of `element`. */
    public static of (element: DataType): ArrayDataType {
        return new ArrayDataType(element);
    }

    protected acceptsNonUnionSource (source: DataType): boolean {
        return source instanceof ArrayDataType && this.element.isAssignableFrom(source.element);
    }

    /**
     * A union element is parenthesized (`(numero|texto)[]`), as the grammar requires: the text can be
     * written back in a `tipo` annotation as is.
     */
    public format (): string {
        const element = this.element.format();
        return `${this.element instanceof UnionDataType ? `(${element})` : element}[]`;
    }
}

/**
 * A fixed-length, position-specific sequence of types, e.g. `[texto, numero]` — unlike
 * `ArrayDataType`, order and length both carry meaning: element 0 must always be the first
 * position's type, element 1 the second's, and a value with a different number of elements simply
 * doesn't match, however its own elements are typed.
 */
export class TupleDataType extends DataType {
    public readonly kind = DataTypeKind.Tuple;
    public readonly elements: DataType[];

    private constructor (elements: DataType[]) {
        super();
        this.elements = elements;
    }

    /** Builds a fixed-length, position-specific tuple `DataType` of `elements`, in order. */
    public static of (elements: DataType[]): TupleDataType {
        return new TupleDataType(elements);
    }

    protected acceptsNonUnionSource (source: DataType): boolean {
        return source instanceof TupleDataType
            && this.elements.length === source.elements.length
            && this.elements.every((element, index) => element.isAssignableFrom(source.elements[index]));
    }

    public format (): string {
        return `[${this.elements.map(element => element.format()).join(', ')}]`;
    }
}
