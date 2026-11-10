import { Test } from "../../../Test";

/**
 * @class GeneratedNameSeyfertCommandTest
 * @description It has to reject a top-level name a command file imports from Seyfert
 */
export class GeneratedNameSeyfertCommandTest extends Test {
    /**
     * @type {string}
     */
    public readonly name: string = 'Generated Name Seyfert Command - Test';

    /**
     * @type {string}
     */
    public readonly description: string = "It has to reject a top-level name a command file imports from Seyfert";

    /**
     * @type {string}
     */
    public readonly expectedError: string = "El nombre 'Command' lo usa DisChord en el código generado de este archivo: renómbralo.";
}
