import { Test } from "../../../Test";

/**
 * @class CommandOptionCollidesCtxTest
 * @description Validates that an option named `ctx`, a name the compiler uses itself, is rejected.
 */
export class CommandOptionCollidesCtxTest extends Test {
    /**
     * @type {string}
     */
    public readonly name: string = 'Command Option Collides Ctx - Test';

    /**
     * @type {string}
     */
    public readonly description: string = "It has to reject an option named ctx";

    /**
     * @type {string}
     */
    public readonly expectedError: string = "La opción 'ctx' choca con un nombre que DisChord usa internamente.";
}
