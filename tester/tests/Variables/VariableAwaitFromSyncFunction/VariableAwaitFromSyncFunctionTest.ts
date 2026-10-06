import { Test } from "../../../Test";

/**
 * @class VariableAwaitFromSyncFunctionTest
 * @description Validates that calling an async function from a function that is not async is rejected.
 */
export class VariableAwaitFromSyncFunctionTest extends Test {
    /**
     * @type {string}
     */
    public readonly name: string = 'Variable Await From Sync Function - Test';

    /**
     * @type {string}
     */
    public readonly description: string = "It has to reject calling an async function from a non-async function";

    /**
     * @type {string}
     */
    public readonly expectedError: string = "Se llama a la función asíncrona 'tarea' desde una función que no es asíncrona";
}
