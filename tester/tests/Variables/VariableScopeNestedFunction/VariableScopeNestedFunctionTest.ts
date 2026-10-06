import { Test } from "../../../Test";

/**
 * @class VariableScopeNestedFunctionTest
 * @description Validates that a nested function gets its own scope, shadowing the enclosing function local while leaving it untouched.
 */
export class VariableScopeNestedFunctionTest extends Test {
    /**
     * @type {string}
     */
    public readonly name: string = 'Variable Scope Nested Function - Test';

    /**
     * @type {string}
     */
    public readonly description: string = "It has to compile a nested function whose local variable shadows one of its enclosing function with another type";
}
