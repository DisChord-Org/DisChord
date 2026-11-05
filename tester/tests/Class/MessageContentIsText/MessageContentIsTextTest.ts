import { Test } from "../../../Test";

/**
 * @class MessageContentIsTextTest
 * @description It has to accept the content of a message where a text is expected, and import the message extensions
 */
export class MessageContentIsTextTest extends Test {
    /**
     * @type {string}
     */
    public readonly name: string = 'Message Content Is Text - Test';

    /**
     * @type {string}
     */
    public readonly description: string = "It has to accept the content of a message where a text is expected, and import the message extensions";
}
