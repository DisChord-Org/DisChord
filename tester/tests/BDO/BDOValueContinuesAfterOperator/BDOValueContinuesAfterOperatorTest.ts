import { Test } from "../../../Test";

/**
 * @class BDOValueContinuesAfterOperatorTest
 * @description Validates that the end of the line closes a property except where the expression asks for more: after an operator, or inside parentheses and lists.
 */
export class BDOValueContinuesAfterOperatorTest extends Test {
    /**
     * @type {string}
     */
    public readonly name: string = 'BDO Value Continues After Operator - Test';

    /**
     * @type {string}
     */
    public readonly description: string = 'It has to keep reading a value that breaks its line after an operator or between brackets';
}
