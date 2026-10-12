import { Test } from "../../../Test";

/**
 * @class ChannelInvalidKindTest
 * @description Validates that `tipoCanal` only takes one of the known channel kinds.
 */
export class ChannelInvalidKindTest extends Test {
    /**
     * @type {string}
     */
    public readonly name: string = 'Channel Invalid Kind - Test';

    /**
     * @type {string}
     */
    public readonly description: string = 'It has to throw when tipoCanal is not one of the channel kinds';

    /**
     * @type {string}
     */
    public readonly expectedError: string = "Tipo de canal inválido: 'inexistente'";
}
