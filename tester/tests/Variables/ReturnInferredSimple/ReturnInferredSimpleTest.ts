import { Test } from "../../../Test";

/**
 * @class ReturnInferredSimpleTest
 * @description Validates that a function without a declared return type gets the type of what it returns, so using it where a text is expected is an error.
 */
export class ReturnInferredSimpleTest extends Test {
    /**
     * @type {string}
     */
    public readonly name: string = 'Return Inferred Simple - Test';

    /**
     * @type {string}
     */
    public readonly description: string = "It has to infer the return type of a function from its devolver";

    /**
     * @type {string}
     */
    public readonly expectedError: string = "se le asignó un valor de tipo 'numero'";
}
