import { Test } from "../../../Test";

/**
 * @class VariableUnionListGroupTest
 * @description Validates that a list can be a member of a union when parenthesized, in every position and nesting.
 */
export class VariableUnionListGroupTest extends Test {
    /**
     * @type {string}
     */
    public readonly name: string = 'Variable Union List Group - Test';

    /**
     * @type {string}
     */
    public readonly description: string = "It has to accept parenthesized arrays as union members";
}
