import { Test } from "../../../Test";

/**
 * @class VariableUnionListMismatchTest
 * @description Validates that a list whose elements fit no member of `(texto[])|numero` is rejected.
 */
export class VariableUnionListMismatchTest extends Test {
    /**
     * @type {string}
     */
    public readonly name: string = 'Variable Union List Mismatch - Test';

    /**
     * @type {string}
     */
    public readonly description: string = "It has to reject a list of the wrong element type for a union with an array member";

    /**
     * @type {string}
     */
    public readonly expectedError: string = "se declaró con tipo 'numero|(texto[])'";
}
