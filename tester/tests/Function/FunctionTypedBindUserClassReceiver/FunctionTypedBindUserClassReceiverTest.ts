import { Test } from "../../../Test";

/**
 * @class FunctionTypedBindUserClassReceiverTest
 * @description Validates that a parameter annotated with a class of the file resolves its async methods by class and keeps a member named like a core library one untouched.
 */
export class FunctionTypedBindUserClassReceiverTest extends Test {
    /**
     * @type {string}
     */
    public readonly name: string = 'Function Typed Bind User Class Receiver - Test';

    /**
     * @type {string}
     */
    public readonly description: string = "It has to await an async method and keep a user method name on a parameter typed with a class of the file";
}
