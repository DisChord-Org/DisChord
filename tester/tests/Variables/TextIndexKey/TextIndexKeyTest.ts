import { Test } from "../../../Test";

/**
 * @class TextIndexKeyTest
 * @description It has to reject a text indexed by a text literal
 */
export class TextIndexKeyTest extends Test {
    /**
     * @type {string}
     */
    public readonly name: string = 'Text Index Key - Test';

    /**
     * @type {string}
     */
    public readonly description: string = "It has to reject a text indexed by a text literal";

    /**
     * @type {string}
     */
    public readonly expectedError: string = "El índice de un texto debe ser un número entero";
}
