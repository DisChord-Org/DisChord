import { Test } from "../../../Test";

/**
 * @class ChannelCreateExplicitServerTest
 * @description Validates that a `servidor` declared in `crear canal` is used as is, even in an event with no server of its own.
 */
export class ChannelCreateExplicitServerTest extends Test {
    /**
     * @type {string}
     */
    public readonly name: string = 'Channel Create Explicit Server - Test';

    /**
     * @type {string}
     */
    public readonly description: string = 'It has to use the declared servidor instead of the one of the context';
}
