import { Test } from "../../../Test";

/**
 * @class ChannelNewShapeIsNotActionTest
 * @description Validates that `nuevo crear canal {` keeps its class instantiation meaning instead
 * of being read as a `crear canal` action: the error is the one of declaring a class named
 * `canal`, not the one of an action outside a command.
 */
export class ChannelNewShapeIsNotActionTest extends Test {
    /**
     * @type {string}
     */
    public readonly name: string = 'Channel New Shape Is Not Action - Test';

    /**
     * @type {string}
     */
    public readonly description: string = 'It has to read nuevo crear canal {} as a class shorthand, not as a channel action';

    /**
     * @type {string}
     */
    public readonly expectedError: string = "No se puede declarar la clase 'canal'";
}
