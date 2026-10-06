import { Test } from "../../../Test";

/**
 * @class CommandNameOptionUpperTest
 * @description Validates that an option name with an uppercase letter is rejected instead of being lowercased.
 */
export class CommandNameOptionUpperTest extends Test {
    /**
     * @type {string}
     */
    public readonly name: string = 'Command Name Option Upper - Test';

    /**
     * @type {string}
     */
    public readonly description: string = "It has to reject an option name with uppercase letters";

    /**
     * @type {string}
     */
    public readonly expectedError: string = "no puede tener mayúsculas";
}
