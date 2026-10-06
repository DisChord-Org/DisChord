import { Test } from "../../../Test";

/**
 * @class VariableAwaitMethodFromSyncFunctionTest
 * @description Validates that calling an async method from a function that is not async is rejected.
 */
export class VariableAwaitMethodFromSyncFunctionTest extends Test {
    /**
     * @type {string}
     */
    public readonly name: string = 'Variable Await Method From Sync Function - Test';

    /**
     * @type {string}
     */
    public readonly description: string = "It has to reject calling an async method from a non-async function";

    /**
     * @type {string}
     */
    public readonly expectedError: string = "Se llama a la función asíncrona 'cargar' desde una función que no es asíncrona";
}
