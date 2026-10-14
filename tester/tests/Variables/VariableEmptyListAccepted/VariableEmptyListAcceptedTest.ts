import { Test } from "../../../Test";

/**
 * @class VariableEmptyListAcceptedTest
 * @description Validates that an empty list stays valid where a list is expected: a list annotation, a reassignment of a list variable and an argument of a list parameter.
 */
export class VariableEmptyListAcceptedTest extends Test {
    /**
     * @type {string}
     */
    public readonly name: string = 'Variable Empty List Accepted - Test';

    /**
     * @type {string}
     */
    public readonly description: string = "It has to accept an empty list wherever a list type is expected";
}
