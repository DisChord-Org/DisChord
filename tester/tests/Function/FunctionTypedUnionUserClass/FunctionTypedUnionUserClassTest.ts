import { Test } from "../../../Test";

/**
 * @class FunctionTypedUnionUserClassTest
 * @description Validates that a class of the file declaring `tiene` in a union makes the call go through the helper, which delegates to the class's own method.
 */
export class FunctionTypedUnionUserClassTest extends Test {
    /**
     * @type {string}
     */
    public readonly name: string = 'Function Typed Union User Class - Test';

    /**
     * @type {string}
     */
    public readonly description: string = "It has to dispatch tiene when a class of the union declares its own";
}
