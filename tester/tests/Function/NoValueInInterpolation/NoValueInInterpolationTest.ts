import { Test } from "../../../Test";

/**
 * @class NoValueInInterpolationTest
 * @description Validates that a call that returns no value is rejected inside an interpolated text.
 */
export class NoValueInInterpolationTest extends Test {
    /**
     * @type {string}
     */
    public readonly name: string = 'No Value In Interpolation - Test';

    /**
     * @type {string}
     */
    public readonly description: string = "It has to reject a call that returns no value inside an interpolated text";

    /**
     * @type {string}
     */
    public readonly expectedError: string = "'g' no devuelve ningún valor, no se puede usar como parte de un texto";
}
