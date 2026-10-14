import { Test } from "../../../Test";

/**
 * @class CommandDescriptionInterpolatedTest
 * @description Validates that the properties of a command are plain text: they are read when the command is registered, before the variables of its handler exist.
 */
export class CommandDescriptionInterpolatedTest extends Test {
    /**
     * @type {string}
     */
    public readonly name: string = 'Command Description Interpolated - Test';

    /**
     * @type {string}
     */
    public readonly description: string = 'It has to reject a text with braces in a property of a command';

    /**
     * @type {string}
     */
    public readonly expectedError: string = "no admite texto con llaves";
}
