import { Test } from "../../../Test";

/**
 * @class ClosedFieldInterpolatedIntentTest
 * @description Validates that an interpolated element in a list of a closed-vocabulary field is rejected.
 */
export class ClosedFieldInterpolatedIntentTest extends Test {
    /**
     * @type {string}
     */
    public readonly name: string = 'Closed Field Interpolated Intent - Test';

    /**
     * @type {string}
     */
    public readonly description: string = "It has to reject an interpolated intent";

    /**
     * @type {string}
     */
    public readonly expectedError: string = "'encender bot' no admite expresiones ni texto con llaves en cada elemento de 'intenciones': escribe uno de:";
}
