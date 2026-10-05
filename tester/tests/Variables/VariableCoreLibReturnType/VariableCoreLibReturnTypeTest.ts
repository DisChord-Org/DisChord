import { Test } from "../../../Test";

/**
 * @class VariableCoreLibReturnTypeTest
 * @description Validates that a variable initialized from a core library call or property read is checked against that member's declared return type, and that a member whose type is unknown (`JSON.leer`) is accepted wherever a type is expected.
 */
export class VariableCoreLibReturnTypeTest extends Test {
    /**
     * @type {string}
     */
    public readonly name: string = 'Variable Core Lib Return Type - Test';

    /**
     * @type {string}
     */
    public readonly description: string = "It has to compile variables whose initializer is a core library member annotated with a type matching its return type, or with one it can't contradict";

}
