import { Test } from "../../../Test";

/**
 * @class TextInterpolationInvalidExpressionTest
 * @description Validates that what is between braces, when it starts with a name, has to be an expression: otherwise the error comes from the parser, pointing into the text.
 */
export class TextInterpolationInvalidExpressionTest extends Test {
    /**
     * @type {string}
     */
    public readonly name: string = 'Text Interpolation Invalid Expression - Test';

    /**
     * @type {string}
     */
    public readonly description: string = 'It has to reject a braced name that is not an expression';

    /**
     * @type {string}
     */
    public readonly expectedError: string = "Token inesperado";
}
