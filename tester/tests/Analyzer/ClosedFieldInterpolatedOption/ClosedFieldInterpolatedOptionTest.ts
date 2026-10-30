import { Test } from "../../../Test";

/**
 * @class ClosedFieldInterpolatedOptionTest
 * @description Validates that an interpolated text as the type of a command option is rejected with the words the field takes.
 */
export class ClosedFieldInterpolatedOptionTest extends Test {
    /**
     * @type {string}
     */
    public readonly name: string = 'Closed Field Interpolated Option - Test';

    /**
     * @type {string}
     */
    public readonly description: string = "It has to reject an interpolated option type";

    /**
     * @type {string}
     */
    public readonly expectedError: string = "no admite expresiones ni texto con llaves en 'tipo': escribe uno de: texto / entero";
}
