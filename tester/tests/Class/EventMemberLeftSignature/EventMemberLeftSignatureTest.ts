import { Test } from "../../../Test";

/**
 * @class EventMemberLeftSignatureTest
 * @description It has to give the user and the server id, not a member, to a member left event
 */
export class EventMemberLeftSignatureTest extends Test {
    /**
     * @type {string}
     */
    public readonly name: string = 'Event Member Left Signature - Test';

    /**
     * @type {string}
     */
    public readonly description: string = "It has to give the user and the server id, not a member, to a member left event";
}
