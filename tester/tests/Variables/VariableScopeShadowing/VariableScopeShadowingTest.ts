import { Test } from "../../../Test";

/**
 * @class VariableScopeShadowingTest
 * @description Validates that a function-local variable shadows a global of the same name without overwriting its type, so the global can still be reassigned with its own type.
 */
export class VariableScopeShadowingTest extends Test {
    /**
     * @type {string}
     */
    public readonly name: string = 'Variable Scope Shadowing - Test';

    /**
     * @type {string}
     */
    public readonly description: string = "It has to keep the global type intact when a function declares a local variable with the same name and a different type";
}
