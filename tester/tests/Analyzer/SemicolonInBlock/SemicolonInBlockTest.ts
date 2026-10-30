import { Test } from "../../../Test";

/**
 * @class SemicolonInBlockTest
 * @description Validates that the properties of a block are not separated with `;`.
 */
export class SemicolonInBlockTest extends Test {
    /**
     * @type {string}
     */
    public readonly name: string = 'Semicolon In Block - Test';

    /**
     * @type {string}
     */
    public readonly description: string = "It has to reject a semicolon between the properties of a block";

    /**
     * @type {string}
     */
    public readonly expectedError: string = "No se usa ';'";
}
