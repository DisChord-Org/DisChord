import { Test } from "../../../Test";

/**
 * @class DirectMessageAndChannelTest
 * @description Validates that `canal` and `usuario` can be declared together inside an
 * `enviar mensaje` block and that both reach the shared `createMessage` helper.
 */
export class DirectMessageAndChannelTest extends Test {
    /**
     * @type {string}
     */
    public readonly name: string = 'Direct Message And Channel - Test';

    /**
     * @type {string}
     */
    public readonly description: string = 'It has to pass both the channel and the user to createMessage when the message block declares them';
}
