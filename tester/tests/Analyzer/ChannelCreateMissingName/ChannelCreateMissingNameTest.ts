import { Test } from "../../../Test";

/**
 * @class ChannelCreateMissingNameTest
 * @description Validates that `crear canal` requires `nombre`.
 */
export class ChannelCreateMissingNameTest extends Test {
    /**
     * @type {string}
     */
    public readonly name: string = 'Channel Create Missing Name - Test';

    /**
     * @type {string}
     */
    public readonly description: string = 'It has to throw when a crear canal block has no nombre';

    /**
     * @type {string}
     */
    public readonly expectedError: string = "En 'crear canal' se esperaba 'nombre'";
}
