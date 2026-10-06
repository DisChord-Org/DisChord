import { Test } from "../../../Test";

/**
 * @class FunctionTypedBindNestedFunctionParamTest
 * @description Validates that a typed parameter of a nested function types its receiver in the body.
 */
export class FunctionTypedBindNestedFunctionParamTest extends Test {
    /**
     * @type {string}
     */
    public readonly name: string = 'Function Typed Bind Nested Function Param - Test';

    /**
     * @type {string}
     */
    public readonly description: string = "It has to translate a member called on a typed parameter of a nested function after its class";
}
