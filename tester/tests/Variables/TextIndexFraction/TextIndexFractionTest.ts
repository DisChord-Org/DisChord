import { Test } from "../../../Test";

/**
 * @class TextIndexFractionTest
 * @description It has to reject a text indexed by a fractional number
 */
export class TextIndexFractionTest extends Test {
    /**
     * @type {string}
     */
    public readonly name: string = 'Text Index Fraction - Test';

    /**
     * @type {string}
     */
    public readonly description: string = "It has to reject a text indexed by a fractional number";

    /**
     * @type {string}
     */
    public readonly expectedError: string = "El índice de un texto debe ser un número entero";
}
