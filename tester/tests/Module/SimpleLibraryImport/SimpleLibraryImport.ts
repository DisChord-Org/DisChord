import { Test } from "../../../Test";

/**
 * @class SimpleLibraryImportTest
 * @description `importar ent` (no `desde`) is sugar for `importar ent desde "lib:ent"` — the parser
 * desugars it to the same `lib:` path, so `ImportVisitor` resolves it exactly like the explicit form.
 */
export class SimpleLibraryImportTest extends Test {
    /**
     * @type {string}
     */
    public readonly name: string = 'Simple Library Import - Test';

    /**
     * @type {string}
     */
    public readonly description: string = "It has to treat 'importar X' without 'desde' as 'importar X desde \"lib:X\"'";
}
