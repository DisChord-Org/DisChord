import { Test } from "../../../Test";

/**
 * @class VariableReservedMemberFreeFunctionTest
 * @description Validates that a reserved word is still rejected as the name of a free function.
 */
export class VariableReservedMemberFreeFunctionTest extends Test {
    /**
     * @type {string}
     */
    public readonly name: string = 'Variable Reserved Member Free Function - Test';

    /**
     * @type {string}
     */
    public readonly description: string = "It has to reject a reserved word as a free function name";

    /**
     * @type {string}
     */
    public readonly expectedError: string = "Se esperaba el nombre de la función.";
}
