import { Test } from "../../../Test";

/**
 * @class IndexAssignNestedOkTest
 * @description Validates that assigning a list to an element of a list of lists compiles.
 */
export class IndexAssignNestedOkTest extends Test {
    /**
     * @type {string}
     */
    public readonly name: string = 'Index Assign Nested Ok - Test';

    /**
     * @type {string}
     */
    public readonly description: string = "It has to accept a list assigned to an element of a list of lists";
}
