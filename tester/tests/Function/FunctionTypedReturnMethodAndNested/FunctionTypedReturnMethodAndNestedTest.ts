import { Test } from "../../../Test";

/**
 * @class FunctionTypedReturnMethodAndNestedTest
 * @description Validates that each `devolver` is checked against the innermost function, in a method and in a function nested in it.
 */
export class FunctionTypedReturnMethodAndNestedTest extends Test {
    /**
     * @type {string}
     */
    public readonly name: string = 'Function Typed Return Method And Nested - Test';

    /**
     * @type {string}
     */
    public readonly description: string = "It has to check a return against the innermost enclosing function";
}
