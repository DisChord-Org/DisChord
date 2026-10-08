import { Test } from "../../../Test";

/**
 * @class MemberAccessAwaitReceiverTest
 * @description Pins how a call on the result of an async call is emitted.
 */
export class MemberAccessAwaitReceiverTest extends Test {
    /**
     * @type {string}
     */
    public readonly name: string = 'Member Access Await Receiver - Test';

    /**
     * @type {string}
     */
    public readonly description: string = "It has to await the receiver and then call the core library member";
}
