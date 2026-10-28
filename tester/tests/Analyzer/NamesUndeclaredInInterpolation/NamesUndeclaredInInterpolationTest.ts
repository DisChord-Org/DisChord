import { Test } from "../../../Test";

/**
 * @class NamesUndeclaredInInterpolationTest
 * @description Validates that a name between the braces of a text is checked like any other.
 */
export class NamesUndeclaredInInterpolationTest extends Test {
    /**
     * @type {string}
     */
    public readonly name: string = 'Names Undeclared In Interpolation - Test';

    /**
     * @type {string}
     */
    public readonly description: string = "It has to reject an undeclared name inside an interpolated text";

    /**
     * @type {string}
     */
    public readonly expectedError: string = "El nombre 'nadie' no está declarado.";
}
