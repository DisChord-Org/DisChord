import { Test } from "../../../Test";

/**
 * @class IndexAssignListOkTest
 * @description Validates that assigning a value of the element type to an element of a typed list compiles.
 */
export class IndexAssignListOkTest extends Test {
    /**
     * @type {string}
     */
    public readonly name: string = 'Index Assign List Ok - Test';

    /**
     * @type {string}
     */
    public readonly description: string = "It has to accept a numero assigned to an element of a numero list";
}
