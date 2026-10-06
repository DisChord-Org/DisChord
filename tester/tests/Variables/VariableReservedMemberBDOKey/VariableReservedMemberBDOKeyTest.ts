import { Test } from "../../../Test";

/**
 * @class VariableReservedMemberBDOKeyTest
 * @description Validates that a reserved word is still rejected as a BDO key.
 */
export class VariableReservedMemberBDOKeyTest extends Test {
    /**
     * @type {string}
     */
    public readonly name: string = 'Variable Reserved Member BDO Key - Test';

    /**
     * @type {string}
     */
    public readonly description: string = "It has to reject a reserved word as a BDO key";

    /**
     * @type {string}
     */
    public readonly expectedError: string = "Token inesperado en expresión: en";
}
