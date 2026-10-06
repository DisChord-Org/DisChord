import { Test } from "../../../Test";

/**
 * @class FunctionTypedAnnotationNadaListReturnTest
 * @description Validates that `nada[]` is rejected as a return type.
 */
export class FunctionTypedAnnotationNadaListReturnTest extends Test {
    /**
     * @type {string}
     */
    public readonly name: string = 'Function Typed Annotation Nada List Return - Test';

    /**
     * @type {string}
     */
    public readonly description: string = "It has to reject a list of nada as a return type";

    /**
     * @type {string}
     */
    public readonly expectedError: string = "'nada' no puede ser el tipo de los elementos de una lista ni de una tupla";
}
