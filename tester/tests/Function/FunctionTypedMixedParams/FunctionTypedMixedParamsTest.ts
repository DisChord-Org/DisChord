import { Test } from "../../../Test";

/**
 * @class FunctionTypedMixedParamsTest
 * @description Validates that typed and untyped parameters can be mixed, keeping an undefined entry in the AST for the untyped one.
 */
export class FunctionTypedMixedParamsTest extends Test {
    /**
     * @type {string}
     */
    public readonly name: string = 'Function Typed Mixed Params - Test';

    /**
     * @type {string}
     */
    public readonly description: string = "It has to compile a function mixing typed and untyped parameters";
}
