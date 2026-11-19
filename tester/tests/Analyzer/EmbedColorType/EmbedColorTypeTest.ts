import { Test } from "../../../Test";

/**
 * @class EmbedColorTypeTest
 * @description Validates that it has to reject a boolean as the color of an embed.
 */
export class EmbedColorTypeTest extends Test {
    /**
     * @type {string}
     */
    public readonly name: string = 'Embed Color Type - Test';

    /**
     * @type {string}
     */
    public readonly description: string = "It has to reject a boolean as the color of an embed";

    /**
     * @type {string}
     */
    public readonly expectedError: string = "'embed' espera un valor de tipo 'numero|texto' en 'color', se recibió 'booleano'";
}
