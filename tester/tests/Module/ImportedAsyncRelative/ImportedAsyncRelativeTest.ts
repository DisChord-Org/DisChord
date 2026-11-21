import { Test } from "../../../Test";

/**
 * @class ImportedAsyncRelativeTest
 * @description The same as `ImportedAsyncLibrary` for a relative import: the `.chord` next to the importing file tells which of its functions are `@asincrono`.
 */
export class ImportedAsyncRelativeTest extends Test {
    /**
     * @type {string}
     */
    public readonly name: string = 'Imported Async Relative - Test';

    /**
     * @type {string}
     */
    public readonly description: string = "It has to await a call to an imported function that is @asincrono in the .chord it is imported from";
}
