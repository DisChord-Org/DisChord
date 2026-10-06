import { Test } from "../../../Test";

/**
 * @class VariableAwaitUnionFromSyncTest
 * @description Validates that calling an async method on a union receiver from a non-async function is rejected.
 */
export class VariableAwaitUnionFromSyncTest extends Test {
    /**
     * @type {string}
     */
    public readonly name: string = 'Variable Await Union From Sync - Test';

    /**
     * @type {string}
     */
    public readonly description: string = "It has to reject an awaited call on a union receiver from a non-async function";

    /**
     * @type {string}
     */
    public readonly expectedError: string = "Se llama a la función asíncrona 'cargar' desde una función que no es asíncrona";
}
