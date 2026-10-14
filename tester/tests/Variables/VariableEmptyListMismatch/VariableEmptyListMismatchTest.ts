import { Test } from "../../../Test";

/**
 * @class VariableEmptyListMismatchTest
 * @description Validates that an empty list is a list of `cualquiera`, so it is rejected where a text is expected.
 */
export class VariableEmptyListMismatchTest extends Test {
    /**
     * @type {string}
     */
    public readonly name: string = 'Variable Empty List Mismatch - Test';

    /**
     * @type {string}
     */
    public readonly description: string = "It has to reject an empty list assigned to a variable annotated as a text";

    /**
     * @type {string}
     */
    public readonly expectedError: string = "se declaró con tipo 'texto' pero se le asignó un valor de tipo 'cualquiera[]'";
}
