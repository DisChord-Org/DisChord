import { Test } from "../../../Test";

/**
 * @class VariableAwaitPromiseFromSyncFunctionTest
 * @description Validates that an async core library member inside a function that is not `@asincrono` is rejected.
 */
export class VariableAwaitPromiseFromSyncFunctionTest extends Test {
    /**
     * @type {string}
     */
    public readonly name: string = 'Variable Await Promise From Sync Function - Test';

    /**
     * @type {string}
     */
    public readonly description: string = "It has to reject Promesa.todas inside a non-async function";

    /**
     * @type {string}
     */
    public readonly expectedError: string = "Se llama a la función asíncrona 'todas' desde una función que no es asíncrona";
}
