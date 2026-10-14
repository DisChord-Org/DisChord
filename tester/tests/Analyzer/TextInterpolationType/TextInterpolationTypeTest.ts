import { Test } from "../../../Test";

/**
 * @class TextInterpolationTypeTest
 * @description Validates that an interpolated text is a `texto` however the expression inside is typed, so assigning it to a `numero` is rejected.
 */
export class TextInterpolationTypeTest extends Test {
    /**
     * @type {string}
     */
    public readonly name: string = 'Text Interpolation Type - Test';

    /**
     * @type {string}
     */
    public readonly description: string = 'It has to type an interpolated text as a text';

    /**
     * @type {string}
     */
    public readonly expectedError: string = "se declaró con tipo 'numero'";
}
