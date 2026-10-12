import { Test } from "../../../Test";

/**
 * @class ChannelUnknownPropertyTest
 * @description Validates that the BDO validator is closed by default: a typo in a channel property is an error that lists what the block takes.
 */
export class ChannelUnknownPropertyTest extends Test {
    /**
     * @type {string}
     */
    public readonly name: string = 'Channel Unknown Property - Test';

    /**
     * @type {string}
     */
    public readonly description: string = 'It has to throw on a misspelled property instead of ignoring it';

    /**
     * @type {string}
     */
    public readonly expectedError: string = "no admite 'nomre'";
}
