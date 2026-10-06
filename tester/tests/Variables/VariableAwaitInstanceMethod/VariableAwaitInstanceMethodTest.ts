import { Test } from "../../../Test";

/**
 * @class VariableAwaitInstanceMethodTest
 * @description Validates that a method of a user class called through an instance of it is awaited, at the top level, inside an async function and inside an async method of another class.
 */
export class VariableAwaitInstanceMethodTest extends Test {
    /**
     * @type {string}
     */
    public readonly name: string = 'Variable Await Instance Method - Test';

    /**
     * @type {string}
     */
    public readonly description: string = "It has to await an async method called through a typed instance in every async context";
}
