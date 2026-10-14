import { Test } from "../../../Test";

/**
 * @class IndexAssignUntypedTest
 * @description Validates that an element of a list whose type was only inferred can be assigned another type.
 */
export class IndexAssignUntypedTest extends Test {
    /**
     * @type {string}
     */
    public readonly name: string = 'Index Assign Untyped - Test';

    /**
     * @type {string}
     */
    public readonly description: string = "It has to leave an index assignment on an untyped list unchecked";
}
