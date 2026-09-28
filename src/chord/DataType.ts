import { PrimitiveType, PrimitiveTypeName } from "./types";

/**
 * @file DataType.ts
 * @description `DataType` — the structural model behind a `var` declaration's `dataType` — mirrors
 * how TypeScript's own checker represents types internally: a real class hierarchy (a primitive, a
 * union of members, an array of an element type, ...), never a pre-serialized string. The string
 * you see in an error message (`'numero|texto[]'`) is a *display* produced by a node's own
 * {@link DataType.format}, the same way TS's checker only turns a `Type` into text when it needs to
 * show one to a user — comparison and compatibility ({@link DataType.isAssignableFrom}) always work
 * on the tree itself, structurally, never on that string.
 *
 * Each shape (primitive/union/array/tuple) is its own subclass of the abstract {@link DataType},
 * owning its own model, construction, assignability and formatting together — the same reason
 * `SubParser`/`SubGenerator`/`AnalysisRule` are one class per grammar rule/node kind/check instead
 * of a single class with a `switch` over all of them. Adding a new shape means adding one new
 * subclass that implements {@link DataType}'s abstract contract; forgetting a method is a compile
 * error, not a silently-wrong `return false` at the end of an `if`-chain.
 *
 * Split out of `types.ts` for the same reason as before: that file is purely declarative
 * (interfaces, type aliases, `const` registries like `TokenType`/`PrimitiveType`), with no actual
 * behavior; everything here is real logic. `PrimitiveType`/`PrimitiveTypeName` themselves stay in
 * `types.ts` — they're a plain data registry, no different from `TokenType`.
 */

/**
 * Discriminates the shape of a `DataType` node — named exactly like `TokenType`/`PrimitiveType`/
 * `FieldKind` (a `const` registry plus a type extracting its values), even though each subclass
 * also knows its own `kind` as a fixed instance field — useful wherever code needs to branch on
 * shape without an `instanceof` chain (e.g. serializing to `expected.ast.json`).
 * @type {const}
 */
export const DataTypeKind = {
    Primitive: 'primitive',
    Union: 'union',
    Array: 'array',
    Tuple: 'tuple'
} as const;

/** Unified type extracting values from the `DataTypeKind` constant registry. */
export type DataTypeKind = typeof DataTypeKind[keyof typeof DataTypeKind];

/**
 * The structural model for everything a `var` declaration's `dataType` can be. Used by both
 * `VariableNode.dataType` (what was written/parsed) and `Symbol.dataType` (what was ultimately
 * resolved) — see each field's own doc comment for how their meanings differ. Always built via a
 * subclass's own static `of(...)` factory, never hand-assembled, and compared/rendered via its own
 * instance methods, never by string comparison.
 */
export abstract class DataType {
    /** Which concrete subclass this is — see {@link DataTypeKind}. */
    abstract readonly kind: DataTypeKind;

    /**
     * Whether a value of type `source` can be used where `this` (the declared/expected type) is
     * expected — the same "is this assignable" question TypeScript's checker answers structurally,
     * recursively, over its own `Type` tree, rather than by comparing display strings.
     *
     * Handles the one rule that's the same regardless of `this`'s own shape — when `source` is a
     * union, *every* member must be assignable to `this` (assigning a broader type requires the
     * narrower target to accept everything the source could actually be) — and otherwise defers to
     * {@link acceptsNonUnionSource}, each subclass's own half of the rule.
     * @param {DataType} source - The type being checked against this one.
     * @returns {boolean} Whether `source` is assignable to `this`.
     */
    public isAssignableFrom (source: DataType): boolean {
        if (source instanceof UnionDataType) return source.members.every(member => this.isAssignableFrom(member));
        return this.acceptsNonUnionSource(source);
    }

    /**
     * The kind-specific half of {@link isAssignableFrom}, reached only once `source` is already
     * known not to be a union.
     * @protected
     */
    protected abstract acceptsNonUnionSource (source: DataType): boolean;

    /**
     * Renders this type to the text a user sees (in a `tipo` annotation's error message, e.g.) —
     * so every message is built the same way instead of each caller re-deriving its own text.
     * @returns {string} This type's display form.
     */
    public abstract format (): string;
}

/** A single primitive, e.g. `texto`. */
export class PrimitiveDataType extends DataType {
    public readonly kind = DataTypeKind.Primitive;
    public readonly name: PrimitiveTypeName;

    private constructor (name: PrimitiveTypeName) {
        super();
        this.name = name;
    }

    /** Builds a bare primitive `DataType`. */
    public static of (name: PrimitiveTypeName): PrimitiveDataType {
        return new PrimitiveDataType(name);
    }

    /**
     * The single canonical correspondence between a native JS `typeof` result and the
     * {@link PrimitiveTypeName} DisChord surfaces for it — the one place this mapping is written,
     * consumed both at compile time (inferring a `var`'s `dataType` from a literal initializer, see
     * `LiteralInferrer`) and at runtime (`UnaryVisitor` embeds this exact object into the generated
     * JS to back the `tipo x` operator, so its key order/values must stay stable).
     * @readonly
     */
    public static readonly typeofMap: Readonly<Record<string, PrimitiveTypeName>> = {
        number: PrimitiveType.Numero,
        string: PrimitiveType.Texto,
        boolean: PrimitiveType.Booleano,
        undefined: PrimitiveType.Indefinido,
        object: PrimitiveType.Objeto
    };

    /** Infers the `PrimitiveDataType` for a native JS value via {@link typeofMap}. */
    public static fromJSValue (value: unknown): PrimitiveDataType | undefined {
        const name = PrimitiveDataType.typeofMap[typeof value];
        return name ? PrimitiveDataType.of(name) : undefined;
    }

    protected acceptsNonUnionSource (source: DataType): boolean {
        return source instanceof PrimitiveDataType && source.name === this.name;
    }

    public format (): string {
        return this.name;
    }
}

/**
 * A union of two or more distinct primitives, e.g. `texto|numero`. Never holds a single member —
 * {@link UnionDataType.of} collapses that case down to a bare {@link PrimitiveDataType} instead,
 * mirroring how TypeScript itself never represents a one-member union as a `UnionType`.
 */
export class UnionDataType extends DataType {
    public readonly kind = DataTypeKind.Union;
    public readonly members: PrimitiveDataType[];

    private constructor (members: PrimitiveDataType[]) {
        super();
        this.members = members;
    }

    /**
     * Builds the `DataType` for a set of one or more primitive kinds, deduplicated: a single
     * distinct kind collapses to a bare {@link PrimitiveDataType} (matching TypeScript's own
     * collapsing of a one-member union); two or more become a {@link UnionDataType}, in the order
     * first encountered (order carries no meaning for a union — see {@link isAssignableFrom} — but
     * member order is kept stable for readable, deterministic {@link format} output).
     * @param {PrimitiveTypeName[]} kinds - The primitive kinds the type is a union of (always at
     * least one).
     * @returns {DataType} The resulting primitive or union type.
     */
    public static of (kinds: PrimitiveTypeName[]): DataType {
        const unique = Array.from(new Set(kinds));

        return unique.length === 1
            ? PrimitiveDataType.of(unique[0])
            : new UnionDataType(unique.map(PrimitiveDataType.of));
    }

    protected acceptsNonUnionSource (source: DataType): boolean {
        return this.members.some(member => member.isAssignableFrom(source));
    }

    public format (): string {
        return this.members.map(member => member.name).sort().join('|');
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

    /** Builds a homogeneous array `DataType` of `element`. */
    public static of (element: DataType): ArrayDataType {
        return new ArrayDataType(element);
    }

    protected acceptsNonUnionSource (source: DataType): boolean {
        return source instanceof ArrayDataType && this.element.isAssignableFrom(source.element);
    }

    public format (): string {
        return `${this.element.format()}[]`;
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
