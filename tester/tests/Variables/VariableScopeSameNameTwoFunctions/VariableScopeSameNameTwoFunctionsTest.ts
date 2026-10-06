import { Test } from "../../../Test";

/**
 * @class VariableScopeSameNameTwoFunctionsTest
 * @description Validates that two functions can declare the same variable name with different types, each keeping its own.
 */
export class VariableScopeSameNameTwoFunctionsTest extends Test {
    /**
     * @type {string}
     */
    public readonly name: string = 'Variable Scope Same Name Two Functions - Test';

    /**
     * @type {string}
     */
    public readonly description: string = "It has to compile two functions each declaring a local variable with the same name and a different type";
}
