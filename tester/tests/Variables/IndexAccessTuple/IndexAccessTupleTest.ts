import { Test } from "../../../Test";

/**
 * @class IndexAccessTupleTest
 * @description Validates that indexing a tuple with a literal gives the type at that position.
 */
export class IndexAccessTupleTest extends Test {
    /**
     * @type {string}
     */
    public readonly name: string = 'Index Access Tuple - Test';

    /**
     * @type {string}
     */
    public readonly description: string = "It has to pick the class of each position of a tuple";
}
