import { Test } from "../../../Test";

/**
 * @class ListInferClassMismatchTest
 * @description Validates that a list of instances is rejected where a list of another type is expected.
 */
export class ListInferClassMismatchTest extends Test {
    /**
     * @type {string}
     */
    public readonly name: string = 'ListInferClass Mismatch - Test';

    /**
     * @type {string}
     */
    public readonly description: string = "It has to reject a list of instances annotated with another element type";

    /**
     * @type {string}
     */
    public readonly expectedError: string = "La variable 'x' se declaró con tipo 'texto[]' pero se le asignó un valor de tipo 'A[]'";
}
