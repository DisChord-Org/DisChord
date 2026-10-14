import { Test } from "../../../Test";

/**
 * @class ChannelGetAtTopLevelTest
 * @description Validates that reading a channel needs a command or an event, since the server and the permissions come from its context.
 */
export class ChannelGetAtTopLevelTest extends Test {
    /**
     * @type {string}
     */
    public readonly name: string = 'Channel Get At Top Level - Test';

    /**
     * @type {string}
     */
    public readonly description: string = 'It has to throw when obtener canal is used outside a command or event';

    /**
     * @type {string}
     */
    public readonly expectedError: string = "'obtener canal' solo puede usarse dentro de un comando o un evento";
}
