import { Test } from "../../../Test";

/**
 * @class MessageAttachmentsAreTextsTest
 * @description It has to type the attachments of a message as a list of texts and its mentions as a list of users
 */
export class MessageAttachmentsAreTextsTest extends Test {
    /**
     * @type {string}
     */
    public readonly name: string = 'Message Attachments Are Texts - Test';

    /**
     * @type {string}
     */
    public readonly description: string = "It has to type the attachments of a message as a list of texts and its mentions as a list of users";
}
