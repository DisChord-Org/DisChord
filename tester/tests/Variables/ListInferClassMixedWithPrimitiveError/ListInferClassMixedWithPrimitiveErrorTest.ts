import { Test } from "../../../Test";

/**
 * @class ListInferClassMixedWithPrimitiveErrorTest
 * @description Validates that the union inferred for a mixed list is not accepted as a list of just one of its members.
 */
export class ListInferClassMixedWithPrimitiveErrorTest extends Test {
    /**
     * @type {string}
     */
    public readonly name: string = 'ListInferClass Mixed With Primitive Error - Test';

    /**
     * @type {string}
     */
    public readonly description: string = "It has to reject a mixed list as a list of numbers";

    /**
     * @type {string}
     */
    public readonly expectedError: string = "La variable 'z' se declaró con tipo 'numero[]' pero se le asignó un valor de tipo '(A|numero)[]'";
}
