import { Test } from "../../../Test";

/**
 * @class VariableReservedMemberDanglingParenTest
 * @description Validates that a dot followed by a closing parenthesis is still a syntax error.
 */
export class VariableReservedMemberDanglingParenTest extends Test {
    /**
     * @type {string}
     */
    public readonly name: string = 'Variable Reserved Member Dangling Paren - Test';

    /**
     * @type {string}
     */
    public readonly description: string = "It has to reject a dot followed by a closing parenthesis";

    /**
     * @type {string}
     */
    public readonly expectedError: string = "Se esperaba un nombre tras '.'";
}
