import { PrimitiveType, PrimitiveTypeName } from "../types";
import type { ClassRegistry } from "../ClassRegistry";
import { DataTypeKind, DataType } from "./base";
import type { ArrayDataType } from "./composite";

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
     * Whether a type is exactly the primitive `name`.
     * @param {DataType | undefined} type - The type to check, if there is one.
     * @param {PrimitiveTypeName} name - The primitive.
     */
    public static is (type: DataType | undefined, name: PrimitiveTypeName): boolean {
        return type instanceof PrimitiveDataType && type.name === name;
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

    /** The name `cualquiera` is written with in a type annotation. */
    public static readonly typeName = 'cualquiera';

    /** The shared `cualquiera` instance. */
    public static readonly Any = new AnyDataType();

    protected acceptsNonUnionSource (): boolean {
        return true;
    }

    public format (): string {
        return AnyDataType.typeName;
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

    /** The name `nada` is written with in a type annotation. */
    public static readonly typeName = 'nada';

    /** The shared `nada` instance. */
    public static readonly Void = new VoidDataType();

    protected acceptsNonUnionSource (source: DataType): boolean {
        return source instanceof VoidDataType;
    }

    public format (): string {
        return VoidDataType.typeName;
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
 * carries only the class name — what the instance holds is not tracked. Classes are nominal: an
 * instance is assignable to its own class and to the classes it extends, directly or through others,
 * but not to the ones it is unrelated to, nor a base instance to a subclass. A `tipo` annotation writes
 * it by name; the parser can't tell whether the class exists (it may be declared further down), so
 * `ValidateTypeAnnotationsRule` checks that. The identity is the name, so two classes of the same name
 * in different scopes are the same type.
 *
 * It holds the compilation's `ClassRegistry` (not enumerable, so it isn't part of a serialized type)
 * to know who extends whom; the registry is filled after annotations are parsed, but it is the same
 * live object. A type built without one accepts any other class instance.
 */
export class UserClassDataType extends DataType {
    public readonly kind = DataTypeKind.UserClass;
    public readonly name: string;
    declare public readonly registry?: ClassRegistry;

    private constructor (name: string, registry?: ClassRegistry) {
        super();
        this.name = name;
        Object.defineProperty(this, 'registry', { value: registry, enumerable: false });
    }

    /** Builds the `DataType` of an instance of the user class called `name`, in the compilation `registry` belongs to. */
    public static of (name: string, registry?: ClassRegistry): UserClassDataType {
        return new UserClassDataType(name, registry);
    }

    protected acceptsNonUnionSource (source: DataType): boolean {
        if (!(source instanceof UserClassDataType)) return false;

        const registry = this.registry ?? source.registry;
        return registry === undefined || registry.isSubclassOf(source.name, this.name);
    }

    public format (): string {
        return this.name;
    }
}
