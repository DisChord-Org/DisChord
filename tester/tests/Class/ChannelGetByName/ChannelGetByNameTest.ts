import { Test } from "../../../Test";

/**
 * @class ChannelGetByNameTest
 * @description It has to generate a getChannel call that searches the channel by its name
 */
export class ChannelGetByNameTest extends Test {
    /**
     * @type {string}
     */
    public readonly name: string = 'Channel Get By Name - Test';

    /**
     * @type {string}
     */
    public readonly description: string = 'It has to generate a getChannel call that searches the channel by its name';
}
