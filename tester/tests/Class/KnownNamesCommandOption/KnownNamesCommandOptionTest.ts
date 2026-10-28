import { Test } from "../../../Test";

/**
 * @class KnownNamesCommandOptionTest
 * @description Validates that the options of a command are known names inside its body.
 */
export class KnownNamesCommandOptionTest extends Test {
    /**
     * @type {string}
     */
    public readonly name: string = 'Known Names Command Option - Test';

    /**
     * @type {string}
     */
    public readonly description: string = "It has to accept the options of a command";
}
