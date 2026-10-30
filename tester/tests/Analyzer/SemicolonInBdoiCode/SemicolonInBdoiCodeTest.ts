import { Test } from "../../../Test";

/**
 * @class SemicolonInBdoiCodeTest
 * @description Validates that the code part of an intelligent block does not take `;` either.
 */
export class SemicolonInBdoiCodeTest extends Test {
    /**
     * @type {string}
     */
    public readonly name: string = 'Semicolon In Bdoi Code - Test';

    /**
     * @type {string}
     */
    public readonly description: string = "It has to reject a semicolon in the code of an intelligent block";

    /**
     * @type {string}
     */
    public readonly expectedError: string = "No se usa ';'";
}
