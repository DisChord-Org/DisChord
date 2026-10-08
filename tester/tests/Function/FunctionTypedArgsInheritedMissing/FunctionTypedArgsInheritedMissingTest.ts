import { Test } from "../../../Test";

/**
 * @class FunctionTypedArgsInheritedMissingTest
 * @description Validates that a missing argument for an inherited constructor is rejected.
 */
export class FunctionTypedArgsInheritedMissingTest extends Test {
    /**
     * @type {string}
     */
    public readonly name: string = 'FunctionTypedArgs Inherited Missing - Test';

    /**
     * @type {string}
     */
    public readonly description: string = "It has to reject a call with too few arguments for an inherited constructor";

    /**
     * @type {string}
     */
    public readonly expectedError: string = "'B' espera 1 argumento(s) pero se le pasaron 0";
}
