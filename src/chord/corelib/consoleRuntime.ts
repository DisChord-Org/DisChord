import { SharedModule } from "../model/SharedModule";

/**
 * The shared `console.log` override module: raw JavaScript, written once to
 * `dist/lib/consoleRuntime.js` (only when at least one compiled file actually calls
 * `consola.imprimir`) and imported — for its side effect only — by any file that does, instead of
 * every generated file duplicating the override inline.
 * @type {SharedModule}
 */
export const consoleRuntimeModule: SharedModule = {
    path: 'lib/consoleRuntime.js',
    content: `
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
`
};
