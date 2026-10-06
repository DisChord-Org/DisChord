import { Test } from "../../../Test";

/**
 * @class FunctionTypedReturnNadaAssignedTest
 * @description Validates that using the result of a function declared `-> nada` is rejected like the one of a core library call without value.
 */
export class FunctionTypedReturnNadaAssignedTest extends Test {
    /**
     * @type {string}
     */
    public readonly name: string = 'Function Typed Return Nada Assigned - Test';

    /**
     * @type {string}
     */
    public readonly description: string = "It has to reject initializing a variable from a function declaring nada";

    /**
     * @type {string}
     */
    public readonly expectedError: string = "se inicializó con una llamada que no devuelve ningún valor";
}
