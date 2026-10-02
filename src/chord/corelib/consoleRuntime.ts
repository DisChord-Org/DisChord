/**
 * Path, relative to the project's `dist` directory, where `consoleRuntimeModuleContent` is
 * written. Shared by `CompileCommand` (which writes the file there) and `Generator` (which
 * imports it), so both sides agree on the location from a single source of truth.
 * @type {string}
 */
export const consoleRuntimeModulePath = 'lib/consoleRuntime.js';

/**
 * Raw JavaScript string content for the shared `console.log` override module. Written once to
 * `dist/lib/consoleRuntime.js` (only when at least one compiled file actually calls
 * `consola.imprimir`) and imported — for its side effect only — by any file that does, instead of
 * every generated file duplicating the override inline.
 * @type {string}
 */
export const consoleRuntimeModuleContent = `
    const originalLog = console.log;

    console.log = (...args) => {
        const translatedArgs = args.map((arg) => {
            if (arg === true) return 'verdadero';
            if (arg === false) return 'falso';
            if (arg === null || arg === undefined) return 'indefinido';

            return arg;
        });

        originalLog(...translatedArgs);
    };
` as const;