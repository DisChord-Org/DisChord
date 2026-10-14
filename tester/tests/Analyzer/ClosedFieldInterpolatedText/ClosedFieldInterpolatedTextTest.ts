import { Test } from "../../../Test";

/**
 * @class ClosedFieldInterpolatedTextTest
 * @description Validates that a text with braces in a closed-vocabulary field is rejected, since it is an expression.
 */
export class ClosedFieldInterpolatedTextTest extends Test {
    /**
     * @type {string}
     */
    public readonly name: string = 'Closed Field Interpolated Text - Test';

    /**
     * @type {string}
     */
    public readonly description: string = "It has to reject an interpolated text as the style of a button";

    /**
     * @type {string}
     */
    public readonly expectedError: string = "'boton' no admite expresiones ni texto con llaves en 'estilo': escribe uno de:";
}
