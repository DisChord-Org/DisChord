import { Test } from "../../../Test";

/**
 * @class ChannelDeleteTest
 * @description Validates that `borrar canal { ... }` is generated as an awaited `deleteChannel` call and that the shared `channels` module is imported only for the actions the file uses.
 */
export class ChannelDeleteTest extends Test {
    /**
     * @type {string}
     */
    public readonly name: string = 'Channel Delete - Test';

    /**
     * @type {string}
     */
    public readonly description: string = 'It has to generate a deleteChannel call with the target and the reason';
}
