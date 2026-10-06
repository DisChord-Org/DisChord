import { Test } from "../../../Test";

/**
 * @class FunctionTypedAnnotationUnknownParamTest
 * @description Validates that a parameter annotated with an unknown class is rejected.
 */
export class FunctionTypedAnnotationUnknownParamTest extends Test {
    /**
     * @type {string}
     */
    public readonly name: string = 'Function Typed Annotation Unknown Param - Test';

    /**
     * @type {string}
     */
    public readonly description: string = "It has to reject an unknown type name in a parameter annotation";

    /**
     * @type {string}
     */
    public readonly expectedError: string = "Tipo desconocido 'mango'";
}
