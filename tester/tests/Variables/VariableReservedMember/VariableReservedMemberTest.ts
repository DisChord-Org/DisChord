import { Test } from "../../../Test";

/**
 * @class VariableReservedMemberTest
 * @description Validates that reserved words are accepted as member names after a dot, and as class method and property names.
 */
export class VariableReservedMemberTest extends Test {
    /**
     * @type {string}
     */
    public readonly name: string = 'Variable Reserved Member - Test';

    /**
     * @type {string}
     */
    public readonly description: string = "It has to compile reserved words used as member names, keeping decimals intact";
}
