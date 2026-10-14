import { Test } from "../../../Test";

/**
 * @class TextInterpolationTest
 * @description Validates that `{expresion}` inside a text is the expression written there, joined to the rest of the text as `mas` would, whatever its position in the text.
 */
export class TextInterpolationTest extends Test {
    /**
     * @type {string}
     */
    public readonly name: string = 'Text Interpolation - Test';

    /**
     * @type {string}
     */
    public readonly description: string = 'It has to turn the names between braces inside a text into a concatenation';
}
