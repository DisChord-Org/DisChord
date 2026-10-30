import { Test } from "../../../Test";

/**
 * @class SemicolonAfterPropertyTest
 * @description Validates that a `;` after the last property of a block is rejected.
 */
export class SemicolonAfterPropertyTest extends Test {
    /**
     * @type {string}
     */
    public readonly name: string = 'Semicolon After Property - Test';

    /**
     * @type {string}
     */
    public readonly description: string = "It has to reject a semicolon at the end of a property";

    /**
     * @type {string}
     */
    public readonly expectedError: string = "No se usa ';'";
}
