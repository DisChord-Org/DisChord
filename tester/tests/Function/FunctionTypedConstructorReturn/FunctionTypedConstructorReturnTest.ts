import { Test } from "../../../Test";

/**
 * @class FunctionTypedConstructorReturnTest
 * @description Validates that a constructor can not declare a return type.
 */
export class FunctionTypedConstructorReturnTest extends Test {
    /**
     * @type {string}
     */
    public readonly name: string = 'Function Typed Constructor Return - Test';

    /**
     * @type {string}
     */
    public readonly description: string = "It has to reject a return type on a constructor";

    /**
     * @type {string}
     */
    public readonly expectedError: string = "Un constructor no puede declarar un tipo de retorno";
}
