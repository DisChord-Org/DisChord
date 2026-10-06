import { Test } from "../../../Test";

/**
 * @class CommandNameOptionAccentTest
 * @description Validates that an option name with an accent and a ñ is accepted.
 */
export class CommandNameOptionAccentTest extends Test {
    /**
     * @type {string}
     */
    public readonly name: string = 'Command Name Option Accent - Test';

    /**
     * @type {string}
     */
    public readonly description: string = "It has to accept a lowercase accented option name";
}
