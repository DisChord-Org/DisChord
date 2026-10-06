import { Test } from "../../../Test";

/**
 * @class FunctionTypedArgsExtraTest
 * @description Validates that extra arguments are rejected when the function is annotated.
 */
export class FunctionTypedArgsExtraTest extends Test {
    /**
     * @type {string}
     */
    public readonly name: string = 'Function Typed Args Extra - Test';

    /**
     * @type {string}
     */
    public readonly description: string = "It has to reject a call with more arguments than the annotated function declares";

    /**
     * @type {string}
     */
    public readonly expectedError: string = "'hayEn' espera 2 argumento(s) pero se le pasaron 3";
}
