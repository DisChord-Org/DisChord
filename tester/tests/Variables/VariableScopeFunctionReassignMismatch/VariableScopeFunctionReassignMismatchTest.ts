import { Test } from "../../../Test";

/**
 * @class VariableScopeFunctionReassignMismatchTest
 * @description Validates that a reassignment inside a function body is checked against the type of the variable declared in that same body.
 */
export class VariableScopeFunctionReassignMismatchTest extends Test {
    /**
     * @type {string}
     */
    public readonly name: string = 'Variable Scope Function Reassign Mismatch - Test';

    /**
     * @type {string}
     */
    public readonly description: string = "It has to reject a reassignment, inside a function, that contradicts the declared type of a local variable";

    /**
     * @type {string}
     */
    public readonly expectedError: string = "La variable 'local' es de tipo 'numero'";
}
