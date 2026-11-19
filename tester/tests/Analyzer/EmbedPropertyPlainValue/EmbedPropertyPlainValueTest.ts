import { Test } from "../../../Test";

/**
 * @class EmbedPropertyPlainValueTest
 * @description Validates that it has to reject a number as the embed of a message.
 */
export class EmbedPropertyPlainValueTest extends Test {
    /**
     * @type {string}
     */
    public readonly name: string = 'Embed Property Plain Value - Test';

    /**
     * @type {string}
     */
    public readonly description: string = "It has to reject a number as the embed of a message";

    /**
     * @type {string}
     */
    public readonly expectedError: string = "'embed' espera un bloque { ... }, el nombre de un embed declarado o una lista de ellos, se recibió un valor de tipo 'numero'";
}
