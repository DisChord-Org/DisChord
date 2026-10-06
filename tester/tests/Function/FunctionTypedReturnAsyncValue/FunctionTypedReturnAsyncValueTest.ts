import { Test } from "../../../Test";

/**
 * @class FunctionTypedReturnAsyncValueTest
 * @description Validates that the declared type of an async function is the type of the value it resolves to, which the call is awaited into.
 */
export class FunctionTypedReturnAsyncValueTest extends Test {
    /**
     * @type {string}
     */
    public readonly name: string = 'Function Typed Return Async Value - Test';

    /**
     * @type {string}
     */
    public readonly description: string = "It has to type a call to an async function as its declared value type";
}
