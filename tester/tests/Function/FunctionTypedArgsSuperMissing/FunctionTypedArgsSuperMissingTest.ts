import { Test } from "../../../Test";

/**
 * @class FunctionTypedArgsSuperMissingTest
 * @description Validates that `super()` without the arguments the parent constructor needs is rejected.
 */
export class FunctionTypedArgsSuperMissingTest extends Test {
    /**
     * @type {string}
     */
    public readonly name: string = 'FunctionTypedArgs Super Missing - Test';

    /**
     * @type {string}
     */
    public readonly description: string = "It has to reject super with too few arguments";

    /**
     * @type {string}
     */
    public readonly expectedError: string = "'A' espera 1 argumento(s) pero se le pasaron 0";
}
