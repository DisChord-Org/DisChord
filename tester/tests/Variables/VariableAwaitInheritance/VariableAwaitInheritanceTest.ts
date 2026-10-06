import { Test } from "../../../Test";

/**
 * @class VariableAwaitInheritanceTest
 * @description Validates that an async method inherited from a parent class of the file is found through the instance of the child class.
 */
export class VariableAwaitInheritanceTest extends Test {
    /**
     * @type {string}
     */
    public readonly name: string = 'Variable Await Inheritance - Test';

    /**
     * @type {string}
     */
    public readonly description: string = "It has to await an async method inherited from a parent class";
}
