import { Test } from "../../../Test";

/**
 * @class GeneratedNameClientTest
 * @description It has to reject client in a file with encender bot
 */
export class GeneratedNameClientTest extends Test {
    /**
     * @type {string}
     */
    public readonly name: string = 'Generated Name Client - Test';

    /**
     * @type {string}
     */
    public readonly description: string = "It has to reject client in a file with encender bot";

    /**
     * @type {string}
     */
    public readonly expectedError: string = "El nombre 'client' lo usa DisChord en el código generado de este archivo: renómbralo.";
}
