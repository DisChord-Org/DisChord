import { Test } from "../../../Test";

/**
 * @class VariableUserExtensionsPrototypeMemberTest
 * @description Validates that reading members `usuario` inherits from `Object.prototype` does not count as reading a Spanish user property, so the user extensions module is not imported.
 */
export class VariableUserExtensionsPrototypeMemberTest extends Test {
    /**
     * @type {string}
     */
    public readonly name: string = 'Variable User Extensions Prototype Member - Test';

    /**
     * @type {string}
     */
    public readonly description: string = "It has to compile prototype member reads on usuario without importing the user extensions module";
}
