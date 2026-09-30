import { ClassesEnum } from "./corelib.data";

/**
 * A single member (method or property) of a core library class, keyed by its name in the
 * source language inside `CoreLibClass`.
 */
export interface CoreLibMember {
    /** JavaScript identifier this member is emitted as. */
    readonly transpile: string;
    /** Whether it is called on the class itself (like `consola.imprimir`) instead of an instance. Omitted means `false`. */
    readonly static?: boolean;
}

/**
 * A core library class: its callable members and, separately, the ones emitted as plain property
 * accesses such as `longitud` → `.length`, so the generator knows whether to emit a call.
 */
export interface CoreLibClass {
    readonly methods: Readonly<Record<string, CoreLibMember>>;
    readonly properties?: Readonly<Record<string, CoreLibMember>>;
}

/**
 * Shape of the whole core library, with one entry per `ClassesEnum` value.
 */
export interface CoreLib {
    readonly classes: Readonly<Record<ClassesEnum, CoreLibClass>>;
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