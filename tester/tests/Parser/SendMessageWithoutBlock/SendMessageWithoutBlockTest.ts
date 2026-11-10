import { Test } from "../../../Test";

/**
 * @class SendMessageWithoutBlockTest
 * @description It has to point at the stray value after enviar mensaje instead of asking for a blank line
 */
export class SendMessageWithoutBlockTest extends Test {
    /**
     * @type {string}
     */
    public readonly name: string = 'Send Message Without Block - Test';

    /**
     * @type {string}
     */
    public readonly description: string = "It has to point at the stray value after enviar mensaje instead of asking for a blank line";

    /**
     * @type {string}
     */
    public readonly expectedError: string = "Sobra '5': una propiedad se escribe como 'clave valor'";
}
