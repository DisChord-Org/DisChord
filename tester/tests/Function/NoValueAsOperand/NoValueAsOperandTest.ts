import { Test } from "../../../Test";

/**
 * @class NoValueAsOperandTest
 * @description Validates that a call that returns no value is rejected as an operand.
 */
export class NoValueAsOperandTest extends Test {
    /**
     * @type {string}
     */
    public readonly name: string = 'No Value As Operand - Test';

    /**
     * @type {string}
     */
    public readonly description: string = "It has to reject a call that returns no value as an operand";

    /**
     * @type {string}
     */
    public readonly expectedError: string = "'g' no devuelve ningún valor, no se puede usar como operando";
}
