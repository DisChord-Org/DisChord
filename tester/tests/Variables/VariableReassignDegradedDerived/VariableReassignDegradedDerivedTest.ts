import { Test } from "../../../Test";

/**
 * @class VariableReassignDegradedDerivedTest
 * @description Validates that a variable derived from a degraded one is cualquiera too.
 */
export class VariableReassignDegradedDerivedTest extends Test {
    /**
     * @type {string}
     */
    public readonly name: string = 'VariableReassign Degraded Derived - Test';

    /**
     * @type {string}
     */
    public readonly description: string = "It has to accept a value derived from a variable reassigned to another type";
}
