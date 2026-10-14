import { Test } from "../../../Test";

/**
 * @class ChannelListTest
 * @description Validates that `listar canales { ... }` without filters is generated as an awaited `listChannels` call taking the server and no filters.
 */
export class ChannelListTest extends Test {
    /**
     * @type {string}
     */
    public readonly name: string = 'Channel List - Test';

    /**
     * @type {string}
     */
    public readonly description: string = 'It has to generate a listChannels call with the server and no filters';
}
