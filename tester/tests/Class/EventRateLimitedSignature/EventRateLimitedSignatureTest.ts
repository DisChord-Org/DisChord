import { Test } from "../../../Test";

/**
 * @class EventRateLimitedSignatureTest
 * @description It has to receive the client as the second argument of a rate limited event
 */
export class EventRateLimitedSignatureTest extends Test {
    /**
     * @type {string}
     */
    public readonly name: string = 'Event Rate Limited Signature - Test';

    /**
     * @type {string}
     */
    public readonly description: string = "It has to receive the client as the second argument of a rate limited event";
}
