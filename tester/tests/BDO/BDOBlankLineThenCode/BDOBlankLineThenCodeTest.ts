import { Test } from "../../../Test";

/**
 * @class BDOBlankLineThenCodeTest
 * @description Validates that a block with properties followed by an empty line and code is an intelligent BDO, with no `;` anywhere.
 */
export class BDOBlankLineThenCodeTest extends Test {
    /**
     * @type {string}
     */
    public readonly name: string = 'BDO Blank Line Then Code - Test';

    /**
     * @type {string}
     */
    public readonly description: string = 'It has to take the code after an empty line as the code of the block, with no semicolons';
}
