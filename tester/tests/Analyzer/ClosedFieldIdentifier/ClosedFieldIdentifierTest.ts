import { Test } from "../../../Test";

/**
 * @class ClosedFieldIdentifierTest
 * @description Validates that an identifier in a closed-vocabulary field is rejected with the words the field takes.
 */
export class ClosedFieldIdentifierTest extends Test {
    /**
     * @type {string}
     */
    public readonly name: string = 'Closed Field Identifier - Test';

    /**
     * @type {string}
     */
    public readonly description: string = "It has to reject an identifier as the style of a button";

    /**
     * @type {string}
     */
    public readonly expectedError: string = "'boton' no admite expresiones ni texto con llaves en 'estilo': escribe uno de:";
}
