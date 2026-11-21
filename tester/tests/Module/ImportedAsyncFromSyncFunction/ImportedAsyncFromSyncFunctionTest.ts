import { Test } from "../../../Test";

/**
 * @class ImportedAsyncFromSyncFunctionTest
 * @description An imported `@asincrono` function is awaited, so calling it from a function that is not async is rejected like a call to one of the file.
 */
export class ImportedAsyncFromSyncFunctionTest extends Test {
    /**
     * @type {string}
     */
    public readonly name: string = 'Imported Async From Sync Function - Test';

    /**
     * @type {string}
     */
    public readonly description: string = "It has to reject calling an imported async function from a function that is not async";

    /**
     * @type {string}
     */
    public readonly expectedError: string = "Se llama a la función asíncrona 'cargar' desde una función que no es asíncrona";
}
