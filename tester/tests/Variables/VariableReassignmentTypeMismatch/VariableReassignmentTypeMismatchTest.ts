import { Test } from "../../../Test";

/**
 * @class VariableReassignmentTypeMismatchTest
 * @description Validates that reassigning a variable to a value whose type contradicts its
 * already-resolved `dataType` is rejected during analysis, the same way an initial `tipo`
 * annotation mismatch already is — not just the initializer, every later assignment too.
 */
export class VariableReassignmentTypeMismatchTest extends Test {
    /**
     * @type {string}
     */
    public readonly name: string = 'Variable Reassignment Type Mismatch - Test';

    /**
     * @type {string}
     */
    public readonly description: string = "It has to reject reassigning a variable to a value whose type contradicts its resolved type";

    /**
     * @type {string}
     */
    public readonly expectedError: string = "La variable 'x' es de tipo 'numero' pero se le asignó un valor de tipo 'texto'";
}
