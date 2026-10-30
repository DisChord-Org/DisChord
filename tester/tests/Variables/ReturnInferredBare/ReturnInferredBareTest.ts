import { Test } from "../../../Test";

/**
 * @class ReturnInferredBareTest
 * @description Validates that a `devolver` without a value counts as returning `indefinido`.
 */
export class ReturnInferredBareTest extends Test {
    /**
     * @type {string}
     */
    public readonly name: string = 'Return Inferred Bare - Test';

    /**
     * @type {string}
     */
    public readonly description: string = "It has to count a bare devolver as indefinido";

    /**
     * @type {string}
     */
    public readonly expectedError: string = "se le asignó un valor de tipo 'indefinido|numero'";
}
