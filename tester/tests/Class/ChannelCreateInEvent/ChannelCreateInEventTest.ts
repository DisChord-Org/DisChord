import { Test } from "../../../Test";

/**
 * @class ChannelCreateInEventTest
 * @description Validates that `crear canal` without `servidor`, inside an event, defaults to the server of the event's own parameter (`canal.guildId` for `canalCreado`), decided at compile time.
 */
export class ChannelCreateInEventTest extends Test {
    /**
     * @type {string}
     */
    public readonly name: string = 'Channel Create In Event - Test';

    /**
     * @type {string}
     */
    public readonly description: string = 'It has to default the server of crear canal to the one carried by the parameter of the event';
}
