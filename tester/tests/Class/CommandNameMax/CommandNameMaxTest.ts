import { Test } from "../../../Test";

/**
 * @class CommandNameMaxTest
 * @description Validates that a command name of exactly 32 characters is accepted.
 */
export class CommandNameMaxTest extends Test {
    /**
     * @type {string}
     */
    public readonly name: string = 'Command Name Max - Test';

    /**
     * @type {string}
     */
    public readonly description: string = "It has to accept a 32 character command name";
}
