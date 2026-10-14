import { Test } from "../../../Test";

/**
 * @class IndexAssignNestedMismatchTest
 * @description Validates that assigning a number to an element of a list of lists is rejected.
 */
export class IndexAssignNestedMismatchTest extends Test {
    /**
     * @type {string}
     */
    public readonly name: string = 'Index Assign Nested Mismatch - Test';

    /**
     * @type {string}
     */
    public readonly description: string = "It has to reject a numero assigned to an element of a list of lists";

    /**
     * @type {string}
     */
    public readonly expectedError: string = "La variable 'm[0]' es de tipo 'numero[]' pero se le asignó un valor de tipo 'numero'";
}
