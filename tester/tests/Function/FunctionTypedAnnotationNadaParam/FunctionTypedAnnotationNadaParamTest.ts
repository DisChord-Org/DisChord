import { Test } from "../../../Test";

/**
 * @class FunctionTypedAnnotationNadaParamTest
 * @description Validates that `nada` is rejected as a parameter type.
 */
export class FunctionTypedAnnotationNadaParamTest extends Test {
    /**
     * @type {string}
     */
    public readonly name: string = 'Function Typed Annotation Nada Param - Test';

    /**
     * @type {string}
     */
    public readonly description: string = "It has to reject nada as a parameter type";

    /**
     * @type {string}
     */
    public readonly expectedError: string = "'nada' solo puede usarse como tipo de retorno";
}
