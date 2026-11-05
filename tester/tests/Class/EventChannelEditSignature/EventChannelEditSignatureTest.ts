import { Test } from "../../../Test";

/**
 * @class EventChannelEditSignatureTest
 * @description It has to destructure the new and the previous channel from the first argument of a channel edited event
 */
export class EventChannelEditSignatureTest extends Test {
    /**
     * @type {string}
     */
    public readonly name: string = 'Event Channel Edit Signature - Test';

    /**
     * @type {string}
     */
    public readonly description: string = "It has to destructure the new and the previous channel from the first argument of a channel edited event";
}
