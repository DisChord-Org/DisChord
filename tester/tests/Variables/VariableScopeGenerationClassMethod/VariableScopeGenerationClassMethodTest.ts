import { Test } from "../../../Test";

/**
 * @class VariableScopeGenerationClassMethodTest
 * @description Validates that the generator reopens a class method scope, so a member shared by several classes is translated after the receiver type of a method-local variable.
 */
export class VariableScopeGenerationClassMethodTest extends Test {
    /**
     * @type {string}
     */
    public readonly name: string = 'Variable Scope Generation Class Method - Test';

    /**
     * @type {string}
     */
    public readonly description: string = "It has to translate a shared member after the type of a local receiver inside a class method";
}
