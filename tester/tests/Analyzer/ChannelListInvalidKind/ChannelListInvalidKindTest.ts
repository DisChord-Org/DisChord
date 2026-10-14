import { Test } from "../../../Test";

/**
 * @class ChannelListInvalidKindTest
 * @description Validates that the `tipo` filter of `listar canales` takes the same vocabulary as `crear canal`.
 */
export class ChannelListInvalidKindTest extends Test {
    /**
     * @type {string}
     */
    public readonly name: string = 'Channel List Invalid Kind - Test';

    /**
     * @type {string}
     */
    public readonly description: string = 'It has to throw on an unknown channel kind in listar canales';

    /**
     * @type {string}
     */
    public readonly expectedError: string = "Tipo de canal inválido";
}
