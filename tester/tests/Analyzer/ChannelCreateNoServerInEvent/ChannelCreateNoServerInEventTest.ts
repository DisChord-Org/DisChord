import { Test } from "../../../Test";

/**
 * @class ChannelCreateNoServerInEventTest
 * @description Validates that `crear canal` without `servidor` inside an event whose parameters carry no server (`encendido`) is rejected at compile time.
 */
export class ChannelCreateNoServerInEventTest extends Test {
    /**
     * @type {string}
     */
    public readonly name: string = 'Channel Create No Server In Event - Test';

    /**
     * @type {string}
     */
    public readonly description: string = 'It has to throw when crear canal has no server to default to in an event without one';

    /**
     * @type {string}
     */
    public readonly expectedError: string = "no trae un servidor";
}
