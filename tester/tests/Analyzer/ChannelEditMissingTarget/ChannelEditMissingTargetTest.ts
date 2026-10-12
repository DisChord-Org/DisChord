import { Test } from "../../../Test";

/**
 * @class ChannelEditMissingTargetTest
 * @description Validates that `editar canal` requires `canal`, the channel to edit.
 */
export class ChannelEditMissingTargetTest extends Test {
    /**
     * @type {string}
     */
    public readonly name: string = 'Channel Edit Missing Target - Test';

    /**
     * @type {string}
     */
    public readonly description: string = 'It has to throw when an editar canal block has no canal';

    /**
     * @type {string}
     */
    public readonly expectedError: string = "En 'editar canal' se esperaba 'canal'";
}
