import { Test } from "../../../Test";

/**
 * @class CommandOptionCollidesContextoTest
 * @description Validates that an option named `contexto`, a name the compiler uses itself, is rejected.
 */
export class CommandOptionCollidesContextoTest extends Test {
    /**
     * @type {string}
     */
    public readonly name: string = 'Command Option Collides Contexto - Test';

    /**
     * @type {string}
     */
    public readonly description: string = "It has to reject an option named contexto";

    /**
     * @type {string}
     */
    public readonly expectedError: string = "La opción 'contexto' choca con un nombre que DisChord usa internamente.";
}
