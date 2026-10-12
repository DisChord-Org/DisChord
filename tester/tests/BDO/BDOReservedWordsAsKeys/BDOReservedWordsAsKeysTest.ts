import { Test } from "../../../Test";

/**
 * @class BDOReservedWordsAsKeysTest
 * @description Validates that words that start statements (`si`, `clase`, `funcion`, `var`, `devolver`) name a property when a plain value follows them.
 */
export class BDOReservedWordsAsKeysTest extends Test {
    /**
     * @type {string}
     */
    public readonly name: string = 'BDO Reserved Words As Keys - Test';

    /**
     * @type {string}
     */
    public readonly description: string = 'It has to accept reserved words as property keys';
}
