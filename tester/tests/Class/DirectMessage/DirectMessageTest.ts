import { Test } from "../../../Test";

/**
 * @class DirectMessageTest
 * @description Validates that `usuario` inside an `enviar mensaje` block is forwarded to the
 * shared `createMessage` helper, which delivers the message as a direct message.
 */
export class DirectMessageTest extends Test {
    /**
     * @type {string}
     */
    public readonly name: string = 'Direct Message - Test';

    /**
     * @type {string}
     */
    public readonly description: string = 'It has to pass the target user to createMessage when the message block declares one';
}
