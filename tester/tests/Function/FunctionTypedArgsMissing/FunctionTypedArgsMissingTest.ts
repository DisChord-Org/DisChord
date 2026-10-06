import { Test } from "../../../Test";

/**
 * @class FunctionTypedArgsMissingTest
 * @description Validates that a missing argument is rejected for a typed parameter that does not admit `indefinido`.
 */
export class FunctionTypedArgsMissingTest extends Test {
    /**
     * @type {string}
     */
    public readonly name: string = 'Function Typed Args Missing - Test';

    /**
     * @type {string}
     */
    public readonly description: string = "It has to reject a call with fewer arguments than the annotated function declares";

    /**
     * @type {string}
     */
    public readonly expectedError: string = "'hayEn' espera 2 argumento(s) pero se le pasaron 1";
}
