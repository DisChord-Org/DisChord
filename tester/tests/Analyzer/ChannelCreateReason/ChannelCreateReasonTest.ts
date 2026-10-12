import { Test } from "../../../Test";

/**
 * @class ChannelCreateReasonTest
 * @description Validates that a property the action does not take (`razon` in `crear canal`, which Seyfert's create has no reason for) is an error instead of being dropped silently.
 */
export class ChannelCreateReasonTest extends Test {
    /**
     * @type {string}
     */
    public readonly name: string = 'Channel Create Reason - Test';

    /**
     * @type {string}
     */
    public readonly description: string = 'It has to throw when a crear canal block declares a property it does not take';

    /**
     * @type {string}
     */
    public readonly expectedError: string = "'crear canal' no admite 'razon'";
}
