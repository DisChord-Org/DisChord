import { DataType } from "../DataType";

/**
 * A single member (method or property) of a core library class, keyed by its name in the
 * source language inside `CoreLibClass`.
 */
export interface CoreLibMember {
    /** JavaScript identifier this member is emitted as. */
    readonly transpile: string;
    /** Whether it is called on the class itself (like `consola.imprimir`) instead of an instance. Omitted means `false`. */
    readonly static?: boolean;
    /** Whether it is provided by a runtime module. */
    readonly runtime?: boolean;
    /** Whether it returns a promise the compiler awaits on its own, like a function marked `@asincrono`. Omitted means `false`. */
    readonly async?: boolean;
    /** Type of the value a call to this member produces, or of the member itself for a property. */
    readonly returns: DataType;
}

/**
 * A core library class: its callable members and, separately, the ones emitted as plain property
 * accesses such as `longitud` → `.length`, so the generator knows whether to emit a call.
 */
export interface CoreLibClass {
    readonly receiver?: DataType;
    /** JavaScript constructor is emitted as (`Mapa` → `Map`). Omitted means the class can't be instantiated. */
    readonly constructs?: string;
    readonly methods: Readonly<Record<string, CoreLibMember>>;
    readonly properties?: Readonly<Record<string, CoreLibMember>>;
}

/**
 * Shape of the whole core library: one entry per class name `C` (a layer's `ClassesEnum`), plus
 * the free functions that have no class to hang off.
 */
export interface CoreLib<C extends string = string> {
    readonly classes: Readonly<Record<C, CoreLibClass>>;
    /** Free functions rewritten to a different callee, keyed by their name in the source language (`imprimir` → `cliente.logger.info`). */
    readonly functions: Readonly<Record<string, string>>;
}

/**
 * A core library member found for a name written in source code.
 */
export interface ResolvedMember {
    /** Fully qualified name in the source language. */
    readonly qualifiedName: string;
    /** Its mapping: what it transpiles to and whether it is static. */
    readonly member: CoreLibMember;
    /** `true` if it is emitted as a property access (`.length`) instead of a call (`.split(...)`). */
    readonly isProperty: boolean;
}