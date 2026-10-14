import { Test } from "../../../Test";

/**
 * @class ChannelGetInLoopTest
 * @description Validates that reading a channel is allowed inside a loop, unlike the actions that write.
 */
export class ChannelGetInLoopTest extends Test {
    /**
     * @type {string}
     */
    public readonly name: string = 'Channel Get In Loop - Test';

    /**
     * @type {string}
     */
    public readonly description: string = 'It has to compile obtener canal inside a para loop';
}
