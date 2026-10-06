import { Test } from "../../../Test";

/**
 * @class FunctionTypedReturnNoValueTest
 * @description Validates that a bare `devolver` is rejected when the declared type does not admit `nada`.
 */
export class FunctionTypedReturnNoValueTest extends Test {
    /**
     * @type {string}
     */
    public readonly name: string = 'Function Typed Return No Value - Test';

    /**
     * @type {string}
     */
    public readonly description: string = "It has to reject a devolver with no value in a function declaring a value type";

    /**
     * @type {string}
     */
    public readonly expectedError: string = "La función 'f' declara retorno 'numero' pero 'devolver' no devuelve ningún valor";
}
