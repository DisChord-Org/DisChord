import { Test } from "../../../Test";

/**
 * @class VariableBinaryTypeInferenceTest
 * @description Validates that `ResolveVariableTypesRule.inferDataType` compiles unannotated
 * variables identically whether or not their initializer is inferrable — an identifier reference
 * (`b es a`), an arithmetic expression (`c es a mas 3`), a string concatenation (`d`), a
 * comparison (`e`), and a logical `y` (`f`) all still just produce plain `var` declarations in the
 * generated code; inference only affects the `SymbolTable`, never the emitted JavaScript.
 */
export class VariableBinaryTypeInferenceTest extends Test {
    /**
     * @type {string}
     */
    public readonly name: string = 'Variable Binary Type Inference - Test';

    /**
     * @type {string}
     */
    public readonly description: string = "It has to compile variables whose type is inferred from an identifier or a binary expression the same as any other variable declaration";
}
