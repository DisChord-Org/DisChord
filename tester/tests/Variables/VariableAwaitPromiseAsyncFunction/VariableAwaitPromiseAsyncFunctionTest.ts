import { Test } from "../../../Test";

/**
 * @class VariableAwaitPromiseAsyncFunctionTest
 * @description Validates that an async core library member is awaited inside an `@asincrono` function.
 */
export class VariableAwaitPromiseAsyncFunctionTest extends Test {
    /**
     * @type {string}
     */
    public readonly name: string = 'Variable Await Promise Async Function - Test';

    /**
     * @type {string}
     */
    public readonly description: string = "It has to await Promesa.todas inside an async function";
}
