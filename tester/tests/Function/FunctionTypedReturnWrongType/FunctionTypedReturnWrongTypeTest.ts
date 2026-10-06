import { Test } from "../../../Test";

/**
 * @class FunctionTypedReturnWrongTypeTest
 * @description Validates that returning a value of another type than the declared one is rejected.
 */
export class FunctionTypedReturnWrongTypeTest extends Test {
    /**
     * @type {string}
     */
    public readonly name: string = 'Function Typed Return Wrong Type - Test';

    /**
     * @type {string}
     */
    public readonly description: string = "It has to reject a returned value contradicting the declared return type";

    /**
     * @type {string}
     */
    public readonly expectedError: string = "La función 'hayEn' declara retorno 'booleano' pero devuelve un valor de tipo 'texto'";
}
