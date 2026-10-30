import { Test } from "../../../Test";

/**
 * @class ReturnInferredMethodTest
 * @description Validates that a method without a declared return type is inferred like a function.
 */
export class ReturnInferredMethodTest extends Test {
    /**
     * @type {string}
     */
    public readonly name: string = 'Return Inferred Method - Test';

    /**
     * @type {string}
     */
    public readonly description: string = "It has to infer the return type of a method";

    /**
     * @type {string}
     */
    public readonly expectedError: string = "se le asignó un valor de tipo 'numero'";
}
