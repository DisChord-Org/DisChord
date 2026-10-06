import { Test } from "../../../Test";

/**
 * @class FunctionTypedReturnNadaWithValueTest
 * @description Validates that a function declared `-> nada` can not return a value.
 */
export class FunctionTypedReturnNadaWithValueTest extends Test {
    /**
     * @type {string}
     */
    public readonly name: string = 'Function Typed Return Nada With Value - Test';

    /**
     * @type {string}
     */
    public readonly description: string = "It has to reject returning a value from a function declaring nada";

    /**
     * @type {string}
     */
    public readonly expectedError: string = "La función 'f' declara retorno 'nada' pero devuelve un valor de tipo 'numero'";
}
