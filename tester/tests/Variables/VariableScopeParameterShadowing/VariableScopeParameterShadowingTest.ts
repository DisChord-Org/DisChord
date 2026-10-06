import { Test } from "../../../Test";

/**
 * @class VariableScopeParameterShadowingTest
 * @description Validates that a function parameter shadows a typed global of the same name, so it is neither typed nor checked after it.
 */
export class VariableScopeParameterShadowingTest extends Test {
    /**
     * @type {string}
     */
    public readonly name: string = 'Variable Scope Parameter Shadowing - Test';

    /**
     * @type {string}
     */
    public readonly description: string = "It has to compile a function whose parameter shares its name with a typed global";
}
