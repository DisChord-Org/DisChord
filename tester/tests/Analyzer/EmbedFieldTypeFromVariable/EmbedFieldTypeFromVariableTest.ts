import { Test } from "../../../Test";

/**
 * @class EmbedFieldTypeFromVariableTest
 * @description Validates that it has to reject a local variable of the wrong type as the title of an embed.
 */
export class EmbedFieldTypeFromVariableTest extends Test {
    /**
     * @type {string}
     */
    public readonly name: string = 'Embed Field Type From Variable - Test';

    /**
     * @type {string}
     */
    public readonly description: string = "It has to reject a local variable of the wrong type as the title of an embed";

    /**
     * @type {string}
     */
    public readonly expectedError: string = "'embed' espera un valor de tipo 'texto' en 'titulo', se recibió 'numero'";
}
