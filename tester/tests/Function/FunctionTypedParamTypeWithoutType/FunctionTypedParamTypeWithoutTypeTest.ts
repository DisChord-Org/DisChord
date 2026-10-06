import { Test } from "../../../Test";

/**
 * @class FunctionTypedParamTypeWithoutTypeTest
 * @description Validates that `tipo` with no type after it in a parameter is rejected.
 */
export class FunctionTypedParamTypeWithoutTypeTest extends Test {
    /**
     * @type {string}
     */
    public readonly name: string = 'Function Typed Param Type Without Type - Test';

    /**
     * @type {string}
     */
    public readonly description: string = "It has to reject a parameter annotation with no type";

    /**
     * @type {string}
     */
    public readonly expectedError: string = "Se esperaba un tipo válido después de 'tipo'";
}
