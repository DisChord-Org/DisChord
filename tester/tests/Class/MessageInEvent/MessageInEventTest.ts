import { Test } from "../../../Test";

/**
 * @class MessageInEventTest
 * @description Validates that `enviar mensaje` is accepted inside an event, the other place besides
 * a command that declares the `ctx` it needs.
 */
export class MessageInEventTest extends Test {
    /**
     * @type {string}
     */
    public readonly name: string = 'Message In Event - Test';

    /**
     * @type {string}
     */
    public readonly description: string = 'It has to compile enviar mensaje inside an event';
}
