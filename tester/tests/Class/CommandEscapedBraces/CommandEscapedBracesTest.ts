import { Test } from "../../../Test";

/**
 * @class CommandEscapedBracesTest
 * @description Validates that `{{` and `}}` give literal braces in the description of a command, which is text with no interpolation.
 */
export class CommandEscapedBracesTest extends Test {
    /**
     * @type {string}
     */
    public readonly name: string = 'Command Escaped Braces - Test';

    /**
     * @type {string}
     */
    public readonly description: string = 'It has to accept escaped braces in a property of a command';
}
