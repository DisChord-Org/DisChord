import { Test } from "../../../Test";

/**
 * @class FunctionTypedAnnotationNadaUnionReturnTest
 * @description Validates that `nada` is valid in a union return type.
 */
export class FunctionTypedAnnotationNadaUnionReturnTest extends Test {
    /**
     * @type {string}
     */
    public readonly name: string = 'Function Typed Annotation Nada Union Return - Test';

    /**
     * @type {string}
     */
    public readonly description: string = "It has to accept texto|nada as a return type";
}
