import { Test } from "../../../Test";

/**
 * @class FunctionTypedUnionParamTest
 * @description Validates that a parameter can be annotated with a union of primitives and core library classes.
 */
export class FunctionTypedUnionParamTest extends Test {
    /**
     * @type {string}
     */
    public readonly name: string = 'Function Typed Union Param - Test';

    /**
     * @type {string}
     */
    public readonly description: string = "It has to compile a parameter annotated with a union of types";
}
