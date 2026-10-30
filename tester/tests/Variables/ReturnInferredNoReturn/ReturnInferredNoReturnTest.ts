import { Test } from "../../../Test";

/**
 * @class ReturnInferredNoReturnTest
 * @description Validates that a function without any devolver has an unknown return type.
 */
export class ReturnInferredNoReturnTest extends Test {
    /**
     * @type {string}
     */
    public readonly name: string = 'Return Inferred No Return - Test';

    /**
     * @type {string}
     */
    public readonly description: string = "It has to leave unknown the return type of a function with no devolver";
}
