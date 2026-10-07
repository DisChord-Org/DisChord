/**
 * Path, relative to the project's `dist` directory, where `runtimeHelpersModuleContent` is
 * written. Shared by the analyzer rule that imports it and `CompileCommand`, which writes the file.
 * @type {string}
 */
export const runtimeHelpersModulePath = 'lib/runtimeHelpers.js';

/**
 * Names `runtimeHelpersModuleContent` exports. The core library's `transpile` of a helper-backed
 * member (or function) is one of these, so `RequiresRuntimeHelpersRule` knows which ones a file
 * uses and imports only those. They carry a `chord` prefix so they can't collide with a name the
 * user declares (a program is free to define its own `limitar`).
 * @type {ReadonlySet<string>}
 */
export const runtimeHelperNames: ReadonlySet<string> = new Set([
    'chordEsperar',
    'chordElegir',
    'chordMezclar',
    'chordEntre',
    'chordLimitar',
    'chordTiene',
    'chordLimpiar',
    'chordAgregar'
]);

/**
 * Subset of {@link runtimeHelperNames} that return a promise. Like a call to a user function
 * declared `@asincrono`, a call to one of these is emitted with `await`.
 * @type {ReadonlySet<string>}
 */
export const asyncRuntimeHelperNames: ReadonlySet<string> = new Set([ 'chordEsperar' ]);

/**
 * Raw JavaScript string content for the shared helpers that have no one-to-one JavaScript
 * equivalent (`esperar`, `Aleatorio.*`, `Mates.limitar`) and the three that dispatch on the receiver at
 * run time (`chordTiene`, `chordLimpiar`, `chordAgregar`, see `CoreLibUtils.resolveUnionDispatch`), each
 * falling back, when the receiver is neither a core library value nor a list/string, to its own method
 * of the original name if it has one, and else to the native JavaScript member the name has always
 * been emitted as (`includes`, `trim`, `push`). Written once to
 * `dist/lib/runtimeHelpers.js` (only when a compiled file uses at least one) and imported by name
 * by the files that do, instead of each one duplicating them inline.
 * @type {string}
 */
export const runtimeHelpersModuleContent = `
    export function chordEsperar(ms) {
        return new Promise((resolve) => setTimeout(resolve, ms));
    }

    export function chordElegir(list) {
        return list[Math.floor(Math.random() * list.length)];
    }

    export function chordMezclar(list) {
        const copy = [...list];

        for (let i = copy.length - 1; i > 0; i--) {
            const j = Math.floor(Math.random() * (i + 1));
            [copy[i], copy[j]] = [copy[j], copy[i]];
        }

        return copy;
    }

    export function chordEntre(min, max) {
        const low = Math.ceil(Math.min(min, max));
        const high = Math.floor(Math.max(min, max));

        return Math.floor(Math.random() * (high - low + 1)) + low;
    }

    export function chordTiene(receiver, value) {
        if (receiver instanceof Map || receiver instanceof Set) return receiver.has(value);
        if (typeof receiver === 'string' || Array.isArray(receiver)) return receiver.includes(value);

        if (typeof receiver.tiene === 'function') return receiver.tiene(value);

        return receiver.includes(value);
    }

    export function chordLimpiar(receiver) {
        if (receiver instanceof Map || receiver instanceof Set) return receiver.clear();
        if (typeof receiver === 'string') return receiver.trim();

        if (typeof receiver.limpiar === 'function') return receiver.limpiar();

        return receiver.trim();
    }

    export function chordAgregar(receiver, ...args) {
        if (receiver instanceof Set) return receiver.add(...args);
        if (Array.isArray(receiver)) return receiver.push(...args);

        if (typeof receiver.agregar === 'function') return receiver.agregar(...args);

        return receiver.push(...args);
    }

    export function chordLimitar(value, min, max) {
        return Math.min(Math.max(value, Math.min(min, max)), Math.max(min, max));
    }
` as const;
