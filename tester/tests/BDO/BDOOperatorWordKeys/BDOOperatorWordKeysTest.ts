import { Test } from "../../../Test";

/**
 * @class BDOOperatorWordKeysTest
 * @description Validates that an entry ends at the end of its line: a key called `y`, `o`, `mas`, `por` or `es` on the next line is a property, not the operator of the value before it.
 */
export class BDOOperatorWordKeysTest extends Test {
    /**
     * @type {string}
     */
    public readonly name: string = 'BDO Operator Word Keys - Test';

    /**
     * @type {string}
     */
    public readonly description: string = 'It has to keep a key that is an operator word as the key of its own entry';
}
