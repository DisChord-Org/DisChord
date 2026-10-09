import { Test } from "../../../Test";

/**
 * @class ListInferClassSubclassErrorTest
 * @description Validates that a list holding a base instance is rejected where a list of the subclass is expected.
 */
export class ListInferClassSubclassErrorTest extends Test {
    /**
     * @type {string}
     */
    public readonly name: string = 'ListInferClass Subclass Error - Test';

    /**
     * @type {string}
     */
    public readonly description: string = "It has to reject a list with a base instance as a list of the subclass";

    /**
     * @type {string}
     */
    public readonly expectedError: string = "La variable 'w' se declaró con tipo 'B[]' pero se le asignó un valor de tipo '(A|B)[]'";
}
