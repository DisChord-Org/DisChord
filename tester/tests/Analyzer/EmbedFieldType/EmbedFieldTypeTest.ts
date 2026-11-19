import { Test } from "../../../Test";

/**
 * @class EmbedFieldTypeTest
 * @description Validates that it has to reject a number as the description of an embed.
 */
export class EmbedFieldTypeTest extends Test {
    /**
     * @type {string}
     */
    public readonly name: string = 'Embed Field Type - Test';

    /**
     * @type {string}
     */
    public readonly description: string = "It has to reject a number as the description of an embed";

    /**
     * @type {string}
     */
    public readonly expectedError: string = "'embed' espera un valor de tipo 'texto' en 'descripcion', se recibió 'numero'";
}
