import { Test } from "../../../Test";

/**
 * @class VariableAwaitEsperarFromSyncFunctionTest
 * @description Validates that the async `esperar` helper called from a function that is not async is rejected.
 */
export class VariableAwaitEsperarFromSyncFunctionTest extends Test {
    /**
     * @type {string}
     */
    public readonly name: string = 'Variable Await Esperar From Sync Function - Test';

    /**
     * @type {string}
     */
    public readonly description: string = "It has to reject calling esperar from a non-async function";

    /**
     * @type {string}
     */
    public readonly expectedError: string = "Se llama a la función asíncrona 'esperar' desde una función que no es asíncrona";
}
