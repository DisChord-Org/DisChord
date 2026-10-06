import { Test } from "../../../Test";

/**
 * @class FunctionDecoratorSyncParentAsyncChildTest
 * @description Validates that a `@asincrono` nested function is async on its own while its plain parent is not, so the parent calling it is rejected like any other async call from a plain function.
 */
export class FunctionDecoratorSyncParentAsyncChildTest extends Test {
    /**
     * @type {string}
     */
    public readonly name: string = 'Function Decorator Sync Parent Async Child - Test';

    /**
     * @type {string}
     */
    public readonly description: string = "It has to reject calling an async nested function from a non-async parent";

    /**
     * @type {string}
     */
    public readonly expectedError: string = "Se llama a la función asíncrona 'hijo' desde una función que no es asíncrona";
}
