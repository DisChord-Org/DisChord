import { Test } from "../../../Test";

/**
 * @class CommandOptionCollidesClienteTest
 * @description Validates that an option named `cliente`, a name the compiler uses itself, is rejected.
 */
export class CommandOptionCollidesClienteTest extends Test {
    /**
     * @type {string}
     */
    public readonly name: string = 'Command Option Collides Cliente - Test';

    /**
     * @type {string}
     */
    public readonly description: string = "It has to reject an option named cliente";

    /**
     * @type {string}
     */
    public readonly expectedError: string = "La opción 'cliente' choca con un nombre que DisChord usa internamente.";
}
