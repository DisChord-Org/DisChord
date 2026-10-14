import { Test } from "../../../Test";

/**
 * @class ClosedFieldInterpolatedIgnoreTest
 * @description Validates that an interpolated text in the ignorar field of a command is rejected.
 */
export class ClosedFieldInterpolatedIgnoreTest extends Test {
    /**
     * @type {string}
     */
    public readonly name: string = 'Closed Field Interpolated Ignore - Test';

    /**
     * @type {string}
     */
    public readonly description: string = "It has to reject an interpolated value for ignorar";

    /**
     * @type {string}
     */
    public readonly expectedError: string = "'comando' no admite expresiones ni texto con llaves en 'ignorar': escribe uno de: Mensajes / Slashs";
}
