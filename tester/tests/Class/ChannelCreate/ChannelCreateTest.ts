import { Test } from "../../../Test";

/**
 * @class ChannelCreateTest
 * @description Validates that `crear canal { ... }` is generated as an awaited `createChannel` call whose body holds only the properties the block declares, mapped to Discord's field names (`tipo` to its numeric `type`).
 */
export class ChannelCreateTest extends Test {
    /**
     * @type {string}
     */
    public readonly name: string = 'Channel Create - Test';

    /**
     * @type {string}
     */
    public readonly description: string = 'It has to generate a createChannel call with only the declared properties';
}
