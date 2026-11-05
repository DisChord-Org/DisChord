import { Test } from "../../../Test";

/**
 * @class ReturnInferredNoReturnTest
 * @description Validates that a function without any devolver has no return value, so using it as one is rejected.
 */
export class ReturnInferredNoReturnTest extends Test {
    /**
     * @type {string}
     */
    public readonly name: string = 'Return Inferred No Return - Test';

    /**
     * @type {string}
     */
    public readonly description: string = "It has to reject the value of a function with no devolver used as the initializer of a variable";

    /**
     * @type {string}
     */
    public readonly expectedError: string = "La variable 's' se inicializó con una llamada que no devuelve ningún valor";
}
