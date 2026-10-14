import { Test } from "../../../Test";

/**
 * @class ChannelGetMissingIdTest
 * @description Validates that `obtener canal` needs the `id` of the channel.
 */
export class ChannelGetMissingIdTest extends Test {
    /**
     * @type {string}
     */
    public readonly name: string = 'Channel Get Missing Id - Test';

    /**
     * @type {string}
     */
    public readonly description: string = 'It has to throw when obtener canal has no id';

    /**
     * @type {string}
     */
    public readonly expectedError: string = "En 'obtener canal' se esperaba 'id'";
}
