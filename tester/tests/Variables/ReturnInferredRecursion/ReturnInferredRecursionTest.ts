import { Test } from "../../../Test";

/**
 * @class ReturnInferredRecursionTest
 * @description Validates that a recursive call makes the return type unknown, so nothing is rejected.
 */
export class ReturnInferredRecursionTest extends Test {
    /**
     * @type {string}
     */
    public readonly name: string = 'Return Inferred Recursion - Test';

    /**
     * @type {string}
     */
    public readonly description: string = "It has to leave unknown the return type of a recursive function";
}
