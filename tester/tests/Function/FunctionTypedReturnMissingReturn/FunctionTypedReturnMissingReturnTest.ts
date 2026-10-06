import { Test } from "../../../Test";

/**
 * @class FunctionTypedReturnMissingReturnTest
 * @description Validates that a function declaring a return type that does not admit `nada` needs a `devolver`.
 */
export class FunctionTypedReturnMissingReturnTest extends Test {
    /**
     * @type {string}
     */
    public readonly name: string = 'Function Typed Return Missing Return - Test';

    /**
     * @type {string}
     */
    public readonly description: string = "It has to reject a function declaring a value type without any devolver";

    /**
     * @type {string}
     */
    public readonly expectedError: string = "La función 'f' declara retorno 'numero' pero no devuelve ningún valor";
}
