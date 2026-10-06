import { Test } from "../../../Test";

/**
 * @class VariableAwaitThisTest
 * @description Validates that a method called through `esta` is resolved in the enclosing class and awaited.
 */
export class VariableAwaitThisTest extends Test {
    /**
     * @type {string}
     */
    public readonly name: string = 'Variable Await This - Test';

    /**
     * @type {string}
     */
    public readonly description: string = "It has to await an async method called through esta";
}
