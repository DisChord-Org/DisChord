import { Test } from "../../../Test";

/**
 * @class VariableReassignUntypedOtherTypeTest
 * @description Validates that a variable without annotation may be reassigned a value of another type.
 */
export class VariableReassignUntypedOtherTypeTest extends Test {
    /**
     * @type {string}
     */
    public readonly name: string = 'VariableReassign Untyped Other Type - Test';

    /**
     * @type {string}
     */
    public readonly description: string = "It has to compile an unannotated variable reassigned to another type";
}
