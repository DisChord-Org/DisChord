import { Test } from "../../../Test";

/**
 * @class ListIndexNoRangeTest
 * @description Validates that an index past the end of a list is not rejected, as its length is not known.
 */
export class ListIndexNoRangeTest extends Test {
    /**
     * @type {string}
     */
    public readonly name: string = 'List Index No Range - Test';

    /**
     * @type {string}
     */
    public readonly description: string = "It has to leave a list index unchecked for range";
}
