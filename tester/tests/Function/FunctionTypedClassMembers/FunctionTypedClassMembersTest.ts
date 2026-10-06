import { Test } from "../../../Test";

/**
 * @class FunctionTypedClassMembersTest
 * @description Validates that a constructor and a method of a class accept typed parameters, and that the method accepts a return type.
 */
export class FunctionTypedClassMembersTest extends Test {
    /**
     * @type {string}
     */
    public readonly name: string = 'Function Typed Class Members - Test';

    /**
     * @type {string}
     */
    public readonly description: string = "It has to compile typed parameters in a constructor and a method with a return type";
}
