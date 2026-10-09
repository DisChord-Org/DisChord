import { PrimitiveType, PrimitiveTypeName } from "../types";

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
    Any: 'any',
    Void: 'void',
    Class: 'class',
    UserClass: 'userClass',
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
        if (this instanceof AnyDataType || source instanceof AnyDataType) return true;
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

    /** Shared `texto` instance, so callers don't rebuild it with {@link of} each time. */
    public static readonly Texto = PrimitiveDataType.of(PrimitiveType.Texto);
    /** Shared `numero` instance. */
    public static readonly Numero = PrimitiveDataType.of(PrimitiveType.Numero);
    /** Shared `booleano` instance. */
    public static readonly Booleano = PrimitiveDataType.of(PrimitiveType.Booleano);
    /** Shared `indefinido` instance. */
    public static readonly Indefinido = PrimitiveDataType.of(PrimitiveType.Indefinido);
    /** Shared `bdo` instance. */
    public static readonly BDO = PrimitiveDataType.of(PrimitiveType.BDO);

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
        object: PrimitiveType.BDO
    };

    /**
     * What the runtime `tipo x` operator yields for a list. Not a {@link PrimitiveTypeName}: lists
     * are typed structurally (see {@link ArrayDataType}), so `lista` is not valid in a `tipo`
     * annotation, only as a `tipo x` result. Native JS reports a list as `object`, so
     * `UnaryVisitor` checks for it before consulting {@link typeofMap}.
     */
    public static readonly listTypeName = 'lista';

    /**
     * Infers the `PrimitiveDataType` for a native JS value via {@link typeofMap}. `null` is
     * `indefinido` (the language has no `null`), and a list has no primitive type, so it yields
     * `undefined` instead of the `bdo` that `typeof` would report.
     */
    public static fromJSValue (value: unknown): PrimitiveDataType | undefined {
        if (value === null) return PrimitiveDataType.Indefinido;
        if (Array.isArray(value)) return undefined;

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
 * A value whose type isn't known at compile time (what `mapear` or `JSON.leer` produce, say).
 * Compatible with every other type in both directions, so it never causes a mismatch error but
 * also never helps catch one. Not a {@link PrimitiveTypeName}: it can't be written in a `tipo`
 * annotation, it only comes from the core library.
 */
export class AnyDataType extends DataType {
    public readonly kind = DataTypeKind.Any;

    private constructor () {
        super();
    }

    /** The shared `cualquiera` instance. */
    public static readonly Any = new AnyDataType();

    protected acceptsNonUnionSource (): boolean {
        return true;
    }

    public format (): string {
        return 'cualquiera';
    }
}

/**
 * What a call that produces no value returns (`consola.imprimir`, `paraCada`). Distinct from
 * `indefinido`, which is a value you can hold: using a `nada` result (`var x es consola.imprimir()`)
 * is a type error, since only `cualquiera` and another `nada` accept it. Not a
 * {@link PrimitiveTypeName}, so it can't be written in a `tipo` annotation either.
 */
export class VoidDataType extends DataType {
    public readonly kind = DataTypeKind.Void;

    private constructor () {
        super();
    }

    /** The shared `nada` instance. */
    public static readonly Void = new VoidDataType();

    protected acceptsNonUnionSource (source: DataType): boolean {
        return source instanceof VoidDataType;
    }

    public format (): string {
        return 'nada';
    }
}

/**
 * An instance of a core library class that has no primitive of its own (`Mapa`, `Conjunto`,
 * `Promesa`, ...), identified by the class's name. Two are compatible only when they name the same
 * class: a `Mapa` is not a `Conjunto`. It carries no type parameters, so what the class holds is
 * not tracked. It can be part of a union or tuple.
 */
export class ClassDataType extends DataType {
    public readonly kind = DataTypeKind.Class;
    public readonly name: string;

    private constructor (name: string) {
        super();
        this.name = name;
    }

    /** Builds the `DataType` of an instance of the core library class called `name`. */
    public static of (name: string): ClassDataType {
        return new ClassDataType(name);
    }

    protected acceptsNonUnionSource (source: DataType): boolean {
        return source instanceof ClassDataType && source.name === this.name;
    }

    public format (): string {
        return this.name;
    }
}

/**
 * An instance of a class declared in the source file (`nuevo Caja()`, or `esta` inside one). It
 * carries only the class name — what the instance holds is not tracked — and any user class
 * instance is assignable to any other, since the class hierarchy is not modelled here. A `tipo`
 * annotation writes it by name; the parser can't tell whether the class exists (it may be declared further
 * down), so `ValidateTypeAnnotationsRule` checks that.
 */
export class UserClassDataType extends DataType {
    public readonly kind = DataTypeKind.UserClass;
    public readonly name: string;

    private constructor (name: string) {
        super();
        this.name = name;
    }

    /** Builds the `DataType` of an instance of the user class called `name`. */
    public static of (name: string): UserClassDataType {
        return new UserClassDataType(name);
    }

    protected acceptsNonUnionSource (source: DataType): boolean {
        return source instanceof UserClassDataType;
    }

    public format (): string {
        return this.name;
    }
}

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
