import { Test } from "../../../Test";

/**
 * @class GeneratedNameCommandClassTest
 * @description It has to reject the name of the class generated for a command
 */
export class GeneratedNameCommandClassTest extends Test {
    /**
     * @type {string}
     */
    public readonly name: string = 'Generated Name Command Class - Test';

    /**
     * @type {string}
     */
    public readonly description: string = "It has to reject the name of the class generated for a command";

    /**
     * @type {string}
     */
    public readonly expectedError: string = "El nombre 'HolaCommand' lo usa DisChord en el código generado de este archivo: renómbralo.";
}
