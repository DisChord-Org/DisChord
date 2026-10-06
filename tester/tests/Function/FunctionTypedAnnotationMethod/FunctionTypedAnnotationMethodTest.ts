import { Test } from "../../../Test";

/**
 * @class FunctionTypedAnnotationMethodTest
 * @description Validates that a class method parameter annotated with an unknown class is rejected.
 */
export class FunctionTypedAnnotationMethodTest extends Test {
    /**
     * @type {string}
     */
    public readonly name: string = 'Function Typed Annotation Method - Test';

    /**
     * @type {string}
     */
    public readonly description: string = "It has to reject an unknown type name in a method parameter";

    /**
     * @type {string}
     */
    public readonly expectedError: string = "Tipo desconocido 'mango'";
}
