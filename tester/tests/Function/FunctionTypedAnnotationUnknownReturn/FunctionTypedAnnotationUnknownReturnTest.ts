import { Test } from "../../../Test";

/**
 * @class FunctionTypedAnnotationUnknownReturnTest
 * @description Validates that an unknown class as a return type is rejected.
 */
export class FunctionTypedAnnotationUnknownReturnTest extends Test {
    /**
     * @type {string}
     */
    public readonly name: string = 'Function Typed Annotation Unknown Return - Test';

    /**
     * @type {string}
     */
    public readonly description: string = "It has to reject an unknown type name in a return type";

    /**
     * @type {string}
     */
    public readonly expectedError: string = "Tipo desconocido 'mango'";
}
