import { Test } from "../../../Test";

/**
 * @class FunctionTypedVoidReturnTest
 * @description Validates that `nada` is accepted as a return type.
 */
export class FunctionTypedVoidReturnTest extends Test {
    /**
     * @type {string}
     */
    public readonly name: string = 'Function Typed Void Return - Test';

    /**
     * @type {string}
     */
    public readonly description: string = "It has to compile a function declaring nada as its return type";
}
