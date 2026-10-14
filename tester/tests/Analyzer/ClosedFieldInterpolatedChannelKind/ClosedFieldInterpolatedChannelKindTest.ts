import { Test } from "../../../Test";

/**
 * @class ClosedFieldInterpolatedChannelKindTest
 * @description Validates that an interpolated channel kind is rejected with the words the field takes.
 */
export class ClosedFieldInterpolatedChannelKindTest extends Test {
    /**
     * @type {string}
     */
    public readonly name: string = 'Closed Field Interpolated Channel Kind - Test';

    /**
     * @type {string}
     */
    public readonly description: string = "It has to reject an interpolated kind of channel";

    /**
     * @type {string}
     */
    public readonly expectedError: string = "'crear canal' no admite expresiones ni texto con llaves en 'tipo': escribe uno de: texto / voz";
}
