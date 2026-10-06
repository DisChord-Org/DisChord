import { Test } from "../../../Test";

/**
 * @class FunctionTypedBindClassMethodParamTest
 * @description Validates that a typed parameter of a class method types its receiver in the body.
 */
export class FunctionTypedBindClassMethodParamTest extends Test {
    /**
     * @type {string}
     */
    public readonly name: string = 'Function Typed Bind Class Method Param - Test';

    /**
     * @type {string}
     */
    public readonly description: string = "It has to translate a member called on a typed parameter of a method after its class";
}
