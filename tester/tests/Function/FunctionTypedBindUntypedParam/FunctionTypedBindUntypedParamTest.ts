import { Test } from "../../../Test";

/**
 * @class FunctionTypedBindUntypedParamTest
 * @description Validates that a parameter written without a type is still an unknown receiver: a core library name is resolved by name, unless the file declares a member of that name.
 */
export class FunctionTypedBindUntypedParamTest extends Test {
    /**
     * @type {string}
     */
    public readonly name: string = 'Function Typed Bind Untyped Param - Test';

    /**
     * @type {string}
     */
    public readonly description: string = "It has to keep treating an untyped parameter as an unknown receiver";
}
