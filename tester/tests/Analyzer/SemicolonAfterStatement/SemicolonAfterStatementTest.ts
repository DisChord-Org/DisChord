import { Test } from "../../../Test";

/**
 * @class SemicolonAfterStatementTest
 * @description Validates that a `;` at the end of a statement is rejected with a clear message, not a cryptic parser one.
 */
export class SemicolonAfterStatementTest extends Test {
    /**
     * @type {string}
     */
    public readonly name: string = 'Semicolon After Statement - Test';

    /**
     * @type {string}
     */
    public readonly description: string = "It has to reject a semicolon at the end of a statement";

    /**
     * @type {string}
     */
    public readonly expectedError: string = "No se usa ';'";
}
