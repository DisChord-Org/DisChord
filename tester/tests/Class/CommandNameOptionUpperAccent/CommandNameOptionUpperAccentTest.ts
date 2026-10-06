import { Test } from "../../../Test";

/**
 * @class CommandNameOptionUpperAccentTest
 * @description Validates that an option name starting with an accented capital is rejected.
 */
export class CommandNameOptionUpperAccentTest extends Test {
    /**
     * @type {string}
     */
    public readonly name: string = 'Command Name Option Upper Accent - Test';

    /**
     * @type {string}
     */
    public readonly description: string = "It has to reject an option name with an accented capital";

    /**
     * @type {string}
     */
    public readonly expectedError: string = "no puede tener mayúsculas";
}
