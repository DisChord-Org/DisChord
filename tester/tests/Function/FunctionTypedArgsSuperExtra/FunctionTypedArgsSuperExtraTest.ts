import { Test } from "../../../Test";

/**
 * @class FunctionTypedArgsSuperExtraTest
 * @description Validates that `super(...)` with more arguments than the parent constructor takes is rejected.
 */
export class FunctionTypedArgsSuperExtraTest extends Test {
    /**
     * @type {string}
     */
    public readonly name: string = 'FunctionTypedArgs Super Extra - Test';

    /**
     * @type {string}
     */
    public readonly description: string = "It has to reject super with too many arguments";

    /**
     * @type {string}
     */
    public readonly expectedError: string = "'A' espera 1 argumento(s) pero se le pasaron 2";
}
