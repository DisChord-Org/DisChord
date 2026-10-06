import { Test } from "../../../Test";

/**
 * @class CommandNameTooLongTest
 * @description Validates that a command name of 33 characters is rejected at analysis time.
 */
export class CommandNameTooLongTest extends Test {
    /**
     * @type {string}
     */
    public readonly name: string = 'Command Name Too Long - Test';

    /**
     * @type {string}
     */
    public readonly description: string = "It has to reject a 33 character command name";

    /**
     * @type {string}
     */
    public readonly expectedError: string = "debe tener entre 1 y 32 caracteres (tiene 33)";
}
