import { Test } from "../../../Test";

/**
 * @class TextInterpolationBooleansTest
 * @description Validates that a value known to be a `booleano` is written `verdadero`/`falso` when interpolated into a text, and that one of unknown type is left as it is.
 */
export class TextInterpolationBooleansTest extends Test {
    /**
     * @type {string}
     */
    public readonly name: string = 'Text Interpolation Booleans - Test';

    /**
     * @type {string}
     */
    public readonly description: string = 'It has to write the booleans of an interpolated text with the words of the language';
}
