import { Test } from "../../../Test";

/**
 * @class MessageSendReadingParameterTest
 * @description Validates that `enviar mensaje { ... }` still works inside a message event and can use the parameter of the event as a value.
 */
export class MessageSendReadingParameterTest extends Test {
    /**
     * @type {string}
     */
    public readonly name: string = 'Message Send Reading Parameter - Test';

    /**
     * @type {string}
     */
    public readonly description: string = "It has to compile enviar mensaje reading the mensaje parameter of the event";
}
