import { Test } from "../../../Test";

/**
 * @class VariableReservedMemberDanglingTest
 * @description Validates that a dot followed by nothing usable is still a syntax error.
 */
export class VariableReservedMemberDanglingTest extends Test {
    /**
     * @type {string}
     */
    public readonly name: string = 'Variable Reserved Member Dangling - Test';

    /**
     * @type {string}
     */
    public readonly description: string = "It has to reject a dot with no member name after it";

    /**
     * @type {string}
     */
    public readonly expectedError: string = "Se esperaba un nombre tras '.'";
}
