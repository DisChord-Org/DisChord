import { Test } from "../../../Test";

/**
 * @class CommandOptionInterpolatedTest
 * @description Validates that the description of an option, written at module level, is plain text too.
 */
export class CommandOptionInterpolatedTest extends Test {
    /**
     * @type {string}
     */
    public readonly name: string = 'Command Option Interpolated - Test';

    /**
     * @type {string}
     */
    public readonly description: string = 'It has to reject a text with braces in the description of an option';

    /**
     * @type {string}
     */
    public readonly expectedError: string = "no admite texto con llaves";
}
