import { Test } from "../../../Test";

/**
 * @class CommandUnicodeNameUpperTest
 * @description Validates that a command starting with an accented capital (`ÁrbolNavidad`) gets a lowercase accented slug.
 */
export class CommandUnicodeNameUpperTest extends Test {
    /**
     * @type {string}
     */
    public readonly name: string = 'Command Unicode Name Upper - Test';

    /**
     * @type {string}
     */
    public readonly description: string = "It has to lowercase an accented capital in a command name";
}
