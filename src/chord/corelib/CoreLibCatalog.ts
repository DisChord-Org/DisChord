import { AnyDataType, VoidDataType } from "../model/DataType";
import { Decorator, NamedTextLiteral, PrimitiveType, SyntaxFunction } from "../model/types";
import { CoreLibClass, CoreLibMember, CoreLibParameter } from "./corelib.types";
import { CoreLibUtils } from "./CoreLibUtils";
import { asyncRuntimeHelperNames } from "./runtimeHelpers";

/** A parameter of a method, as an editor needs to show it. */
export interface CoreLibParameterDescription {
    readonly name: string;
    /** As written in a `tipo` annotation. A union lists its members in alphabetical order, not in the order a user would write them. */
    readonly type: string;
    readonly optional: boolean;
    readonly rest: boolean;
}

/** A method or property of a core library class, as an editor needs to show it. */
export interface CoreLibMemberDescription {
    /** Name in the source language. */
    readonly name: string;
    /** Type of the value a call produces (or of the property itself), as written in a `tipo` annotation. A union lists its members in alphabetical order, not in the order a user would write them. */
    readonly returns: string;
    /** Parameters in order; `null` when they are not known (not the same as taking none, which is `[]`) and for properties. */
    readonly params: CoreLibParameterDescription[] | null;
    /** What the member does, in one sentence; `null` when nobody wrote it. */
    readonly doc: string | null;
    /** Whether it is used on the class itself (`consola.imprimir`) instead of on a value. */
    readonly static: boolean;
    /** Whether the compiler awaits it on its own. */
    readonly async: boolean;
}

/** A core library class, as an editor needs to show it. */
export interface CoreLibClassDescription {
    readonly name: string;
    /** Type of the values the class's members are used on (`texto` for `Texto`); `null` when the class has none. */
    readonly receiver: string | null;
    /** Whether `nuevo <name>(...)` is allowed. */
    readonly instantiable: boolean;
    /** Whether the compiler puts the name in scope itself (`cliente`, `canal`). */
    readonly injected: boolean;
    readonly methods: CoreLibMemberDescription[];
    readonly properties: CoreLibMemberDescription[];
}

/**
 * A function that can be called without a receiver. `function`s come from the core library;
 * `syntax` ones (`rango`) look like a call but are resolved by the compiler by their shape.
 */
export interface CoreLibFunctionDescription {
    readonly name: string;
    readonly kind: 'function' | 'syntax';
    /** Whether the compiler awaits it on its own. */
    readonly async: boolean;
}

/**
 * A name that can be written as a type. `void` (`nada`) only makes sense as what a function
 * returns, not as the type of a variable or parameter.
 */
export interface CoreLibTypeDescription {
    readonly name: string;
    readonly kind: 'primitive' | 'any' | 'void' | 'class';
}

/** A word that stands for a fixed text (`espacio` is `" "`). */
export interface CoreLibLiteralDescription {
    readonly name: string;
    readonly value: string;
}

/** The vocabulary of the language that is not a reserved word of the keyword registry. */
export interface CoreLibDescription {
    readonly classes: CoreLibClassDescription[];
    readonly functions: CoreLibFunctionDescription[];
    readonly types: CoreLibTypeDescription[];
    readonly literals: CoreLibLiteralDescription[];
    /** Decorators the language knows, with their `@`. */
    readonly decorators: string[];
}

/**
 * Describes the language's vocabulary in plain, serializable data: what a language tool
 * (completion, hover, highlighting) needs, without the compiler's own details such as what each
 * member is transpiled to. Every list is derived from the same constants and tables the compiler
 * uses (the core library, `Decorator`, `NamedTextLiteral`, `SyntaxFunction`, the type registries),
 * so it cannot drift from what the compiler actually recognizes.
 *
 * @template {string} C - Class names present in the table.
 */
export class CoreLibCatalog<C extends string = string> {
    /**
     * Version of the document layout. Adding keys, sections or fields does not change it; renaming
     * or removing one, or changing what it means, does. Consumers are expected to ignore keys they
     * do not know and to tolerate unknown `kind`s. A type is written with the syntax of a `tipo`
     * annotation (`a|b`, `T[]`, `[A, B]`).
     */
    public static readonly schema = 1;

    constructor(private readonly utils: CoreLibUtils<C>) {}

    /**
     * @returns {CoreLibDescription} The vocabulary, every list in declaration order.
     */
    public describe(): CoreLibDescription {
        const corelib = this.utils.corelib;

        return {
            classes: Object.entries<CoreLibClass>(corelib.classes).map(([name, entry]) => this.describeClass(name, entry)),
            functions: [
                ...Object.entries<string>(corelib.functions).map(([name, callee]): CoreLibFunctionDescription => ({
                    name,
                    kind: 'function',
                    async: asyncRuntimeHelperNames.has(callee)
                })),
                ...Object.values(SyntaxFunction).map((name): CoreLibFunctionDescription => ({ name, kind: 'syntax', async: false }))
            ],
            types: [
                ...Object.values(PrimitiveType).map((name): CoreLibTypeDescription => ({ name, kind: 'primitive' })),
                { name: AnyDataType.Any.format(), kind: 'any' },
                { name: VoidDataType.Void.format(), kind: 'void' },
                ...this.utils.annotableClassNames().map((name): CoreLibTypeDescription => ({ name, kind: 'class' }))
            ],
            literals: Object.entries(NamedTextLiteral).map(([name, value]) => ({ name, value })),
            decorators: Object.values(Decorator)
        };
    }

    private describeClass(name: string, entry: CoreLibClass): CoreLibClassDescription {
        return {
            name,
            receiver: entry.receiver?.format() ?? null,
            instantiable: entry.constructs !== undefined,
            injected: entry.injected ?? false,
            methods: this.describeMembers(entry.methods),
            properties: this.describeMembers(entry.properties ?? {})
        };
    }

    private describeMembers(members: Readonly<Record<string, CoreLibMember>>): CoreLibMemberDescription[] {
        return Object.entries(members).map(([name, member]) => ({
            name,
            returns: member.returns.format(),
            params: member.params ? member.params.map(param => this.describeParameter(param)) : null,
            doc: member.doc ?? null,
            static: member.static ?? false,
            async: member.async ?? false
        }));
    }

    private describeParameter(param: CoreLibParameter): CoreLibParameterDescription {
        return {
            name: param.name,
            type: param.type.format(),
            optional: param.optional ?? false,
            rest: param.rest ?? false
        };
    }
}
