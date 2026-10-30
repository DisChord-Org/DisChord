import { Test } from "../../../Test";

/**
 * @class LoopVariableRangeTest
 * @description Validates that the variable of a loop over `rango` is a number.
 */
export class LoopVariableRangeTest extends Test {
    /**
     * @type {string}
     */
    public readonly name: string = 'Loop Variable Range - Test';

    /**
     * @type {string}
     */
    public readonly description: string = "It has to type the variable of a range loop as a number";

    /**
     * @type {string}
     */
    public readonly expectedError: string = "se le asignó un valor de tipo 'numero'";
}
