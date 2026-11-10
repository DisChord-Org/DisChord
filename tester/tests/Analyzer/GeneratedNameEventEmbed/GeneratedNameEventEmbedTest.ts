import { Test } from "../../../Test";

/**
 * @class GeneratedNameEventEmbedTest
 * @description It has to reject Embed in a file with an event
 */
export class GeneratedNameEventEmbedTest extends Test {
    /**
     * @type {string}
     */
    public readonly name: string = 'Generated Name Event Embed - Test';

    /**
     * @type {string}
     */
    public readonly description: string = "It has to reject Embed in a file with an event";

    /**
     * @type {string}
     */
    public readonly expectedError: string = "El nombre 'Embed' lo usa DisChord en el código generado de este archivo: renómbralo.";
}
