import { Test } from "../../../Test";

/**
 * @class ChannelGetByNameNoServerInEventTest
 * @description It has to reject obtener canal by nombre in an event that carries no server
 */
export class ChannelGetByNameNoServerInEventTest extends Test {
    /**
     * @type {string}
     */
    public readonly name: string = 'Channel Get By Name No Server In Event - Test';

    /**
     * @type {string}
     */
    public readonly description: string = "It has to reject obtener canal by nombre in an event that carries no server";

    /**
     * @type {string}
     */
    public readonly expectedError: string = "no trae un servidor";
}
