import { Test } from "../../../Test";

/**
 * @class ParenthesizedExpressionTypeTest
 * @description Validates that grouping does not hide a type: a parenthesized text assigned to a `numero` is rejected like the text alone.
 */
export class ParenthesizedExpressionTypeTest extends Test {
    /**
     * @type {string}
     */
    public readonly name: string = 'Parenthesized Expression Type - Test';

    /**
     * @type {string}
     */
    public readonly description: string = 'It has to type a parenthesized expression as what is inside the parentheses';

    /**
     * @type {string}
     */
    public readonly expectedError: string = "se declaró con tipo 'numero'";
}
