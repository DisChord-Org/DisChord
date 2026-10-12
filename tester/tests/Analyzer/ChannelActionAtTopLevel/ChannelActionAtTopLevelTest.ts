import { Test } from "../../../Test";

/**
 * @class ChannelActionAtTopLevelTest
 * @description Validates that a channel action at the top level is rejected: it has no client nor server in its context.
 */
export class ChannelActionAtTopLevelTest extends Test {
    /**
     * @type {string}
     */
    public readonly name: string = 'Channel Action At Top Level - Test';

    /**
     * @type {string}
     */
    public readonly description: string = 'It has to throw when a channel action is used outside a command or an event';

    /**
     * @type {string}
     */
    public readonly expectedError: string = "solo puede usarse dentro de un comando o un evento";
}
