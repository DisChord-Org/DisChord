import { Test } from "../../../Test";

/**
 * @class FunctionTypedReturnInferredFromCallTest
 * @description Validates that a call to a function with a declared return type is typed by it.
 */
export class FunctionTypedReturnInferredFromCallTest extends Test {
    /**
     * @type {string}
     */
    public readonly name: string = 'Function Typed Return Inferred From Call - Test';

    /**
     * @type {string}
     */
    public readonly description: string = "It has to infer the type of a variable initialized from a function with a declared return type";
}
