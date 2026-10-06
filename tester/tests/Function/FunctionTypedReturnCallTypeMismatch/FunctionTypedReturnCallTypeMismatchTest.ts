import { Test } from "../../../Test";

/**
 * @class FunctionTypedReturnCallTypeMismatchTest
 * @description Validates that a `tipo` annotation contradicting the declared return type of the function called is rejected.
 */
export class FunctionTypedReturnCallTypeMismatchTest extends Test {
    /**
     * @type {string}
     */
    public readonly name: string = 'Function Typed Return Call Type Mismatch - Test';

    /**
     * @type {string}
     */
    public readonly description: string = "It has to reject an annotation contradicting the return type of a user function";

    /**
     * @type {string}
     */
    public readonly expectedError: string = "La variable 'n' se declaró con tipo 'numero' pero se le asignó un valor de tipo 'booleano'";
}
