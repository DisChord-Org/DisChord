import { Test } from "../../../Test";

/**
 * @class GeneratedNameSeyfertEmbedTest
 * @description It has to reject Embed in a file with a command
 */
export class GeneratedNameSeyfertEmbedTest extends Test {
    /**
     * @type {string}
     */
    public readonly name: string = 'Generated Name Seyfert Embed - Test';

    /**
     * @type {string}
     */
    public readonly description: string = "It has to reject Embed in a file with a command";

    /**
     * @type {string}
     */
    public readonly expectedError: string = "El nombre 'Embed' lo usa DisChord en el código generado de este archivo: renómbralo.";
}
