import { Test } from "../../../Test";

/**
 * @class IndexAssignTupleOkTest
 * @description Validates that assigning to a tuple position a value of its type compiles.
 */
export class IndexAssignTupleOkTest extends Test {
    /**
     * @type {string}
     */
    public readonly name: string = 'Index Assign Tuple Ok - Test';

    /**
     * @type {string}
     */
    public readonly description: string = "It has to accept a texto assigned to the texto position of a tuple";
}
