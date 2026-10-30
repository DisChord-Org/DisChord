import { Test } from "../../../Test";

/**
 * @class TextIndexTextVariableTest
 * @description It has to reject a text indexed by a variable of type text
 */
export class TextIndexTextVariableTest extends Test {
    /**
     * @type {string}
     */
    public readonly name: string = 'Text Index Text Variable - Test';

    /**
     * @type {string}
     */
    public readonly description: string = "It has to reject a text indexed by a variable of type text";

    /**
     * @type {string}
     */
    public readonly expectedError: string = "El índice de un texto debe ser un número entero";
}
