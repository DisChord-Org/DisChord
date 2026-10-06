import { Test } from "../../../Test";

/**
 * @class VariableAwaitPromiseFromMethodTest
 * @description Validates that an async core library member inside a class method that is not `@asincrono` is rejected.
 */
export class VariableAwaitPromiseFromMethodTest extends Test {
    /**
     * @type {string}
     */
    public readonly name: string = 'Variable Await Promise From Method - Test';

    /**
     * @type {string}
     */
    public readonly description: string = "It has to reject Promesa.resolver inside a non-async method";

    /**
     * @type {string}
     */
    public readonly expectedError: string = "Se llama a la función asíncrona 'resolver' desde una función que no es asíncrona";
}
