import { Test } from "../../../Test";

/**
 * @class ReturnInferredUnionTest
 * @description Validates that a function returning values of different types is inferred as the union of them.
 */
export class ReturnInferredUnionTest extends Test {
    /**
     * @type {string}
     */
    public readonly name: string = 'Return Inferred Union - Test';

    /**
     * @type {string}
     */
    public readonly description: string = "It has to infer the union of the types a function returns";

    /**
     * @type {string}
     */
    public readonly expectedError: string = "se le asignó un valor de tipo 'numero|texto'";
}
