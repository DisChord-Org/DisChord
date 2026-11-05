import { Test } from "../../../Test";

/**
 * @class ChannelListByNameTest
 * @description It has to pass the nombre and nombreContiene filters to listChannels
 */
export class ChannelListByNameTest extends Test {
    /**
     * @type {string}
     */
    public readonly name: string = 'Channel List By Name - Test';

    /**
     * @type {string}
     */
    public readonly description: string = 'It has to pass the nombre and nombreContiene filters to listChannels';
}
