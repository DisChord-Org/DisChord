import { Test } from "../../../Test";

/**
 * @class EventMessageDeleteSignatureTest
 * @description It has to receive the message and the client as the two arguments of a message deleted event
 */
export class EventMessageDeleteSignatureTest extends Test {
    /**
     * @type {string}
     */
    public readonly name: string = 'Event Message Delete Signature - Test';

    /**
     * @type {string}
     */
    public readonly description: string = "It has to receive the message and the client as the two arguments of a message deleted event";
}
