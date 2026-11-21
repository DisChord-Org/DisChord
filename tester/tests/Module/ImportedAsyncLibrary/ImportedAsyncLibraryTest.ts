import { Test } from "../../../Test";

/**
 * @class ImportedAsyncLibraryTest
 * @description Regression test for imported functions: a call to a function marked `@asincrono` in the Chord source of an installed library (`lib:X`, as `bdlocal`'s `cargar`) was not awaited, since an imported name is opaque. Only the top-level `@asincrono` functions of the source count: a method of a class or a function inside another one does not, and neither does a function that is not marked.
 */
export class ImportedAsyncLibraryTest extends Test {
    /**
     * @type {string}
     */
    public readonly name: string = 'Imported Async Library - Test';

    /**
     * @type {string}
     */
    public readonly description: string = "It has to await a call to an imported function that is @asincrono in the source of its library";
}
