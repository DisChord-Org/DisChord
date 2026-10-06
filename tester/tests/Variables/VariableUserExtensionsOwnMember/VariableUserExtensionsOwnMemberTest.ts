import { Test } from "../../../Test";

/**
 * @class VariableUserExtensionsOwnMemberTest
 * @description Validates that reading a Spanish user property from `usuario` imports the user extensions module.
 */
export class VariableUserExtensionsOwnMemberTest extends Test {
    /**
     * @type {string}
     */
    public readonly name: string = 'Variable User Extensions Own Member - Test';

    /**
     * @type {string}
     */
    public readonly description: string = "It has to import the user extensions module when usuario.nombre is read";
}
