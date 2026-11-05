import { Test } from "../../../Test";

/**
 * @class EventMessageEditSignatureTest
 * @description It has to destructure the new and the previous message from the first argument of a message edited event
 */
export class EventMessageEditSignatureTest extends Test {
    /**
     * @type {string}
     */
    public readonly name: string = 'Event Message Edit Signature - Test';

    /**
     * @type {string}
     */
    public readonly description: string = "It has to destructure the new and the previous message from the first argument of a message edited event";
}
