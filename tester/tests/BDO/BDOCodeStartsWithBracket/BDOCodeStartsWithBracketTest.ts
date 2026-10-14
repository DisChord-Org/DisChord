import { Test } from "../../../Test";

/**
 * @class BDOCodeStartsWithBracketTest
 * @description Validates that a property does not take in a statement that begins with `[` or `(` on the lines after it: the code starts after the empty line.
 */
export class BDOCodeStartsWithBracketTest extends Test {
    /**
     * @type {string}
     */
    public readonly name: string = 'BDO Code Starts With Bracket - Test';

    /**
     * @type {string}
     */
    public readonly description: string = 'It has to start the code of a block with a statement that begins with a bracket';
}
