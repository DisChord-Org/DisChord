import { Test } from "../../../Test";

/**
 * @class VariableReassignArgumentDegradedTest
 * @description Validates that an argument of a degraded variable is accepted.
 */
export class VariableReassignArgumentDegradedTest extends Test {
    /**
     * @type {string}
     */
    public readonly name: string = 'VariableReassign Argument Degraded - Test';

    /**
     * @type {string}
     */
    public readonly description: string = "It has to accept an argument whose variable was reassigned to another type";
}
