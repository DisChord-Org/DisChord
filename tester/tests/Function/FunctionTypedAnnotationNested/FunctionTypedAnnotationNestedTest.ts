import { Test } from "../../../Test";

/**
 * @class FunctionTypedAnnotationNestedTest
 * @description Validates that an unknown class in a union holding a list, in a nested function parameter, is rejected.
 */
export class FunctionTypedAnnotationNestedTest extends Test {
    /**
     * @type {string}
     */
    public readonly name: string = 'Function Typed Annotation Nested - Test';

    /**
     * @type {string}
     */
    public readonly description: string = "It has to reject an unknown class in a nested function parameter union";

    /**
     * @type {string}
     */
    public readonly expectedError: string = "Tipo desconocido 'Caja'";
}
