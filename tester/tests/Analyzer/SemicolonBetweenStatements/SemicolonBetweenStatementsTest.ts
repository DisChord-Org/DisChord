import { Test } from "../../../Test";

/**
 * @class SemicolonBetweenStatementsTest
 * @description Validates that two statements on a line are not separated with `;`.
 */
export class SemicolonBetweenStatementsTest extends Test {
    /**
     * @type {string}
     */
    public readonly name: string = 'Semicolon Between Statements - Test';

    /**
     * @type {string}
     */
    public readonly description: string = "It has to reject a semicolon between two statements on the same line";

    /**
     * @type {string}
     */
    public readonly expectedError: string = "No se usa ';'";
}
