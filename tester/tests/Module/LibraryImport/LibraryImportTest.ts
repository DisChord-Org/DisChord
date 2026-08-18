import { Test } from "../../../Test";

/**
 * @class LibraryImportTest
 * @description Regression test for a real bug in `ImportVisitor`: `importar { x } desde "lib:X"`
 * (the installed-library convention, resolving to `lib/X/src/X`) still hardcoded the `.mjs`
 * extension after the project-wide migration to `.js` output (see commit "dischord now
 * transpiles to 'js' files") — every other import path was updated, this one specific branch was
 * missed, so any project actually using an installed library got a real
 * `ERR_MODULE_NOT_FOUND` at runtime (`ent.mjs` requested, `ent.js` on disk). The same stale
 * `.mjs` branch also existed in `ClientInitVisitor.resolveSpecifierFromProjectRoot`, used when
 * re-emitting imports into `seyfert.config.mjs` — fixed alongside this one.
 */
export class LibraryImportTest extends Test {
    /**
     * @type {string}
     */
    public readonly name: string = 'Library Import - Test';

    /**
     * @type {string}
     */
    public readonly description: string = "It has to resolve 'lib:X' imports to 'lib/X/src/X.js', not the stale '.mjs' extension";
}
