import { Test } from "../../../Test";

/**
 * @class TextInterpolationEscapesTest
 * @description Validates that `{{` and `}}` are a literal brace, and that a brace not followed by a name (`{2}`, `{2,3}`) or never closed stays text.
 */
export class TextInterpolationEscapesTest extends Test {
    /**
     * @type {string}
     */
    public readonly name: string = 'Text Interpolation Escapes - Test';

    /**
     * @type {string}
     */
    public readonly description: string = 'It has to leave as text the braces that are not an expression, and unescape the doubled ones';
}
