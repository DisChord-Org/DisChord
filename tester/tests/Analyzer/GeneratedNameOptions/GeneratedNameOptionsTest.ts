import { Test } from "../../../Test";

/**
 * @class GeneratedNameOptionsTest
 * @description It has to reject a top-level options in a command with options
 */
export class GeneratedNameOptionsTest extends Test {
    /**
     * @type {string}
     */
    public readonly name: string = 'Generated Name Options - Test';

    /**
     * @type {string}
     */
    public readonly description: string = "It has to reject a top-level options in a command with options";

    /**
     * @type {string}
     */
    public readonly expectedError: string = "El nombre 'options' lo usa DisChord en el código generado de este archivo: renómbralo.";
}
