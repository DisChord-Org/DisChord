import { Test } from "../../../Test";

/**
 * @class VariableReassignStableKeepsTypeTest
 * @description Validates that a variable reassigned only with values of its own type keeps that type.
 */
export class VariableReassignStableKeepsTypeTest extends Test {
    /**
     * @type {string}
     */
    public readonly name: string = 'VariableReassign Stable Keeps Type - Test';

    /**
     * @type {string}
     */
    public readonly description: string = "It has to keep the inferred type while reassignments agree";

    /**
     * @type {string}
     */
    public readonly expectedError: string = "La variable 't' se declaró con tipo 'texto' pero se le asignó un valor de tipo 'numero'";
}
