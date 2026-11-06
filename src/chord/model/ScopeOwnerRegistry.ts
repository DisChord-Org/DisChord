import { TokenType } from "./tokens";

/** How a node type that owns a scope runs its body (see {@link ScopeOwnerRegistry.register}). */
export interface ScopeOwnerOptions {
    /** Whether the body always runs inside an async context, so it may `await`. False unless said otherwise. */
    asyncBody?: boolean;
    /** Whether the body runs by itself (a function, a class, a handler) and not as a block of the one that holds it. True unless said otherwise. */
    callable?: boolean;
}

/**
 * Which AST node types own a scope for their body. Chord's own are classes, functions and loops (the
 * variable of a `para` lives in its scope); a dialect adds its own through {@link register}.
 *
 * A registered type is a scope owner; `callable` marks the ones that are a body running by itself
 * (a function, a class, or a dialect's own handler) as opposed to only scoping a block of the body that
 * holds them (a loop), which decides nothing about `await`; `asyncBody` marks the ones whose body always
 * runs in an async context (a function is async only if marked, so it is not listed here).
 */
export class ScopeOwnerRegistry {
    private readonly owners: Map<string, Required<ScopeOwnerOptions>> = new Map([
        [ TokenType.Clase, { asyncBody: false, callable: true } ],
        [ TokenType.Funcion, { asyncBody: false, callable: true } ]
    ]);

    constructor () {
        this.register(TokenType.BUCLE, { callable: false });
    }

    /**
     * Declares that nodes of `type` own a scope for their body. Registering a type again keeps what it
     * was already declared as.
     *
     * @param {string} type - The node type string.
     * @param {ScopeOwnerOptions} [options] - Whether the body runs in an async context and whether it
     * is a body that runs by itself (`callable`, true unless said otherwise) or only a block of the
     * one that holds it.
     */
    public register(type: string, options: ScopeOwnerOptions = {}): void {
        const { asyncBody = false, callable = true } = options;
        const previous = this.owners.get(type);

        this.owners.set(type, {
            asyncBody: asyncBody || (previous?.asyncBody ?? false),
            callable: callable || (previous?.callable ?? false)
        });
    }

    /** Whether nodes of `type` own a scope for their body. */
    public owns(type: string): boolean {
        return this.owners.has(type);
    }

    /** Whether nodes of `type` own a scope and are a body that runs by itself, not just a block of another body. */
    public isCallable(type: string): boolean {
        return this.owners.get(type)?.callable ?? false;
    }

    /** Whether the body of nodes of `type` always runs in an async context. */
    public hasAsyncBody(type: string): boolean {
        return this.owners.get(type)?.asyncBody ?? false;
    }
}
