import { Test } from "../../../Test";

/**
 * @class VariableScopeShadowingMismatchTest
 * @description Validates that inside a function the local variable, not the shadowed global, decides what a reassignment may hold.
 */
export class VariableScopeShadowingMismatchTest extends Test {
    /**
     * @type {string}
     */
    public readonly name: string = 'Variable Scope Shadowing Mismatch - Test';

    /**
     * @type {string}
     */
    public readonly description: string = "It has to reject assigning a number to a local text variable that shadows a numeric global";

    /**
     * @type {string}
     */
    public readonly expectedError: string = "La variable 'x' es de tipo 'texto'";
}
