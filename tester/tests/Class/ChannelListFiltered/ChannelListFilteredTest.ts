import { Test } from "../../../Test";

/**
 * @class ChannelListFilteredTest
 * @description Validates that `listar canales` passes only the filters declared (`tipo` as the numeric channel type and `categoria` as the parent) to `listChannels`.
 */
export class ChannelListFilteredTest extends Test {
    /**
     * @type {string}
     */
    public readonly name: string = 'Channel List Filtered - Test';

    /**
     * @type {string}
     */
    public readonly description: string = 'It has to generate a listChannels call with the declared filters only';
}
