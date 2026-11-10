import { Test } from "../../../Test";

/**
 * @class NoValueAssignedTest
 * @description Validates that a call that returns no value is rejected as the value of an assignment.
 */
export class NoValueAssignedTest extends Test {
    /**
     * @type {string}
     */
    public readonly name: string = 'No Value Assigned - Test';

    /**
     * @type {string}
     */
    public readonly description: string = "It has to reject a call that returns no value as the value of an assignment";

    /**
     * @type {string}
     */
    public readonly expectedError: string = "'g' no devuelve ningún valor, no se puede usar como valor de una asignación";
}
