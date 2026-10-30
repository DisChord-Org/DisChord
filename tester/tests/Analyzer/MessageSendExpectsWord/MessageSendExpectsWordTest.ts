import { Test } from "../../../Test";

/**
 * @class MessageSendExpectsWordTest
 * @description Validates that `enviar` must be followed by `mensaje`.
 */
export class MessageSendExpectsWordTest extends Test {
    /**
     * @type {string}
     */
    public readonly name: string = 'Message Send Expects Word - Test';

    /**
     * @type {string}
     */
    public readonly description: string = "It has to reject enviar followed by another word";

    /**
     * @type {string}
     */
    public readonly expectedError: string = "Después de 'enviar' se esperaba 'mensaje'";
}
