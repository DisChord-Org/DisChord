import { Test } from "../../../Test";

/**
 * @class VariableReassignDeclaredWithoutValueTest
 * @description Validates that a variable declared without a value may be assigned later.
 */
export class VariableReassignDeclaredWithoutValueTest extends Test {
    /**
     * @type {string}
     */
    public readonly name: string = 'VariableReassign Declared Without Value - Test';

    /**
     * @type {string}
     */
    public readonly description: string = "It has to compile a variable declared without a value and assigned later";
}
