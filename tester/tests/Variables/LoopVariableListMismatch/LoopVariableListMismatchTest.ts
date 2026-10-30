import { Test } from "../../../Test";

/**
 * @class LoopVariableListMismatchTest
 * @description Validates that the variable of a loop over a list of numbers is a number.
 */
export class LoopVariableListMismatchTest extends Test {
    /**
     * @type {string}
     */
    public readonly name: string = 'Loop Variable List Mismatch - Test';

    /**
     * @type {string}
     */
    public readonly description: string = "It has to reject a text annotation over the variable of a loop over numbers";

    /**
     * @type {string}
     */
    public readonly expectedError: string = "se le asignó un valor de tipo 'numero'";
}
