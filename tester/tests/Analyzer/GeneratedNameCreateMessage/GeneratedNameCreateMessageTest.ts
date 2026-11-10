import { Test } from "../../../Test";

/**
 * @class GeneratedNameCreateMessageTest
 * @description It has to reject a function named createMessage in a file that sends a message
 */
export class GeneratedNameCreateMessageTest extends Test {
    /**
     * @type {string}
     */
    public readonly name: string = 'Generated Name Create Message - Test';

    /**
     * @type {string}
     */
    public readonly description: string = "It has to reject a function named createMessage in a file that sends a message";

    /**
     * @type {string}
     */
    public readonly expectedError: string = "El nombre 'createMessage' lo usa DisChord en el código generado de este archivo: renómbralo.";
}
