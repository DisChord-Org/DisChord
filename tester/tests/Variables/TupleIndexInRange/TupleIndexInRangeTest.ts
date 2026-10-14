import { Test } from "../../../Test";

/**
 * @class TupleIndexInRangeTest
 * @description Validates that the last valid literal index of a tuple compiles.
 */
export class TupleIndexInRangeTest extends Test {
    /**
     * @type {string}
     */
    public readonly name: string = 'Tuple Index In Range - Test';

    /**
     * @type {string}
     */
    public readonly description: string = "It has to accept the last position of a tuple";
}
