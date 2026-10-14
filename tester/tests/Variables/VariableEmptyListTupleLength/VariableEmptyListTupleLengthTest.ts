import { Test } from "../../../Test";

/**
 * @class VariableEmptyListTupleLengthTest
 * @description Validates that an empty list does not fit a tuple type, because of its length.
 */
export class VariableEmptyListTupleLengthTest extends Test {
    /**
     * @type {string}
     */
    public readonly name: string = 'Variable Empty List Tuple Length - Test';

    /**
     * @type {string}
     */
    public readonly description: string = "It has to reject an empty list assigned to a tuple";

    /**
     * @type {string}
     */
    public readonly expectedError: string = "se declaró como tupla de 2 elemento(s) pero se le asignó una lista de 0";
}
