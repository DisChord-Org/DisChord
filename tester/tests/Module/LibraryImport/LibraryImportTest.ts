import { Test } from "../../../Test";

/**
 * @class LibraryImportTest
 * @description Regression test for a real bug in `ImportVisitor`: `importar { x } desde "lib:X"`
 * (the installed-library convention) resolved to `lib/X/src/X.js` — the specifier named after the
 * library itself — but `chord pkg install` actually publishes every library's entry point as
 * `src/index.js` (npm convention), never `src/<libName>.js`. Any project actually using an
 * installed library (e.g. `procesos`, `sf`) got a real `ERR_MODULE_NOT_FOUND` at runtime
 * (`procesos.js` requested, `index.js` on disk). The same mismatch also existed in
 * `ClientInitVisitor.resolveSpecifierFromProjectRoot`, used when re-emitting imports into
 * `seyfert.config.mjs` — fixed alongside this one.
 */
export class LibraryImportTest extends Test {
    /**
     * @type {string}
     */
    public readonly name: string = 'Library Import - Test';

    /**
     * @type {string}
     */
    public readonly description: string = "It has to resolve 'lib:X' imports to 'lib/X/src/index.js', matching how chord pkg install actually publishes libraries";
}
