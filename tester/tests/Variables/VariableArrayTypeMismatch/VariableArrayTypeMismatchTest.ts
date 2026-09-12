import { Test } from "../../../Test";

/**
 * @class VariableArrayTypeMismatchTest
 * @description Validates that declaring a variable with an explicit `tipo <nombre>[]` annotation
 * that contradicts the homogeneous element type of the list literal it's assigned (e.g.
 * `tipo texto[]` bound to a list of numbers) is rejected during analysis.
 */
export class VariableArrayTypeMismatchTest extends Test {
    /**
     * @type {string}
     */
    public readonly name: string = 'Variable Array Type Mismatch - Test';

    /**
     * @type {string}
     */
    public readonly description: string = "It has to reject a 'tipo <nombre>[]' annotation that contradicts the element type of the list literal assigned to the variable";

    /**
     * @type {string}
     */
    public readonly expectedError: string = "se declaró con tipo 'texto[]' pero se le asignó un valor de tipo 'numero[]'";
}
