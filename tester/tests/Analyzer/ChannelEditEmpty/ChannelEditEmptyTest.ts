import { Test } from "../../../Test";

/**
 * @class ChannelEditEmptyTest
 * @description Validates that `editar canal` with only its target and a reason is rejected, since it would send an empty body.
 */
export class ChannelEditEmptyTest extends Test {
    /**
     * @type {string}
     */
    public readonly name: string = 'Channel Edit Empty - Test';

    /**
     * @type {string}
     */
    public readonly description: string = 'It has to throw when editar canal changes nothing';

    /**
     * @type {string}
     */
    public readonly expectedError: string = "necesita al menos una propiedad que cambiar";
}
