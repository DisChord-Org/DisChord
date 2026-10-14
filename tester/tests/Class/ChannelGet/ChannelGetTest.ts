import { Test } from "../../../Test";

/**
 * @class ChannelGetTest
 * @description Validates that `obtener canal { id ... }` is generated as an awaited `getChannel` call taking the id and the server of the context, and that its result is a channel whose properties can be read.
 */
export class ChannelGetTest extends Test {
    /**
     * @type {string}
     */
    public readonly name: string = 'Channel Get - Test';

    /**
     * @type {string}
     */
    public readonly description: string = 'It has to generate a getChannel call with the id and the server of the context';
}
