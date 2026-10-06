import { Test } from "../../../Test";

/**
 * @class VariableScopeCommandLocalShadowingTest
 * @description Validates that a dischord command body owns a scope, so its local variable shadows a global of the same name instead of colliding with it.
 */
export class VariableScopeCommandLocalShadowingTest extends Test {
    /**
     * @type {string}
     */
    public readonly name: string = 'Variable Scope Command Local Shadowing - Test';

    /**
     * @type {string}
     */
    public readonly description: string = "It has to compile a command declaring a local variable that shares its name with a typed global";
}
