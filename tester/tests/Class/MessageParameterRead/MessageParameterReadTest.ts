import { Test } from "../../../Test";

/**
 * @class MessageParameterReadTest
 * @description Validates that `mensaje`, the parameter of the message events, is an ordinary name and not a reserved word: it can be read inside the event.
 */
export class MessageParameterReadTest extends Test {
    /**
     * @type {string}
     */
    public readonly name: string = 'Message Parameter Read - Test';

    /**
     * @type {string}
     */
    public readonly description: string = "It has to compile an event that reads its mensaje parameter";
}
