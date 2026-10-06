import { Test } from "../../../Test";

/**
 * @class FunctionTypedSignatureTest
 * @description Validates that parameters annotated with `tipo` and a return type written after `->` are parsed and erased from the generated JavaScript, which is the same as the one of the untyped function.
 */
export class FunctionTypedSignatureTest extends Test {
    /**
     * @type {string}
     */
    public readonly name: string = 'Function Typed Signature - Test';

    /**
     * @type {string}
     */
    public readonly description: string = "It has to compile a function with typed parameters and a return type to the same JavaScript as the untyped one";
}
