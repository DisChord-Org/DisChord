import { Test } from "../../../Test";

/**
 * @class FunctionTypedAnnotationConstructorTest
 * @description Validates that a constructor parameter annotated with an unknown class is rejected.
 */
export class FunctionTypedAnnotationConstructorTest extends Test {
    /**
     * @type {string}
     */
    public readonly name: string = 'Function Typed Annotation Constructor - Test';

    /**
     * @type {string}
     */
    public readonly description: string = "It has to reject an unknown type name in a constructor parameter";

    /**
     * @type {string}
     */
    public readonly expectedError: string = "Tipo desconocido 'mango'";
}
