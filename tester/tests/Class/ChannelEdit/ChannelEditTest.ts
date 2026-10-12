import { Test } from "../../../Test";

/**
 * @class ChannelEditTest
 * @description Validates that `editar canal { ... }` is generated as an awaited `editChannel` call taking the target channel, the declared properties and the optional `razon`.
 */
export class ChannelEditTest extends Test {
    /**
     * @type {string}
     */
    public readonly name: string = 'Channel Edit - Test';

    /**
     * @type {string}
     */
    public readonly description: string = 'It has to generate an editChannel call with the target, the changed properties and the reason';
}
