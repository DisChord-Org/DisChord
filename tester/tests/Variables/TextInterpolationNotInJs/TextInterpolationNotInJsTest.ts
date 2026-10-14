import { Test } from "../../../Test";

/**
 * @class TextInterpolationNotInJsTest
 * @description Validates that the text of `js("...")` is JavaScript, not a text of the program, so its braces are not interpolated.
 */
export class TextInterpolationNotInJsTest extends Test {
    /**
     * @type {string}
     */
    public readonly name: string = 'Text Interpolation Not In Js - Test';

    /**
     * @type {string}
     */
    public readonly description: string = 'It has to leave the text of js() as it is written';
}
