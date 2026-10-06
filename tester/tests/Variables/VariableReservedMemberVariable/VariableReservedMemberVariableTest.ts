import { Test } from "../../../Test";

/**
 * @class VariableReservedMemberVariableTest
 * @description Validates that a reserved word is still rejected as a variable name.
 */
export class VariableReservedMemberVariableTest extends Test {
    /**
     * @type {string}
     */
    public readonly name: string = 'Variable Reserved Member Variable - Test';

    /**
     * @type {string}
     */
    public readonly description: string = "It has to reject a reserved word as a variable name";

    /**
     * @type {string}
     */
    public readonly expectedError: string = "Se debe especificar un nombre para la variable.";
}
