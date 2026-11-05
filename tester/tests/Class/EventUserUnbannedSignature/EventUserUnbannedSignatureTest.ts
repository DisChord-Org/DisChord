import { Test } from "../../../Test";

/**
 * @class EventUserUnbannedSignatureTest
 * @description It has to destructure the user and the server id from the object of a user unbanned event
 */
export class EventUserUnbannedSignatureTest extends Test {
    /**
     * @type {string}
     */
    public readonly name: string = 'Event User Unbanned Signature - Test';

    /**
     * @type {string}
     */
    public readonly description: string = "It has to destructure the user and the server id from the object of a user unbanned event";
}
