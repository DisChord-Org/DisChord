import { Test } from "../../../Test";

/**
 * @class FunctionTypedAsyncReturnTest
 * @description Validates that a return type can follow the parameters of a decorated function without disturbing the decorator.
 */
export class FunctionTypedAsyncReturnTest extends Test {
    /**
     * @type {string}
     */
    public readonly name: string = 'Function Typed Async Return - Test';

    /**
     * @type {string}
     */
    public readonly description: string = "It has to compile an async function with typed parameters and a return type";
}
