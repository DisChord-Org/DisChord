import { Test } from "../../../Test";

/**
 * @class TupleIndexDynamicTest
 * @description Validates that an index that is not a literal is not checked against the length of a tuple.
 */
export class TupleIndexDynamicTest extends Test {
    /**
     * @type {string}
     */
    public readonly name: string = 'Tuple Index Dynamic - Test';

    /**
     * @type {string}
     */
    public readonly description: string = "It has to leave a computed tuple index unchecked";
}
