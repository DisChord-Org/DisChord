import { Test } from "../../../Test";

/**
 * @class ClassNominalReturnErrorTest
 * @description Validates that a function declared to return a class may not return an unrelated one.
 */
export class ClassNominalReturnErrorTest extends Test {
    /**
     * @type {string}
     */
    public readonly name: string = 'ClassNominal Return Error - Test';

    /**
     * @type {string}
     */
    public readonly description: string = "It has to reject returning an unrelated class";

    /**
     * @type {string}
     */
    public readonly expectedError: string = "La función 'crear' declara retorno 'A' pero devuelve un valor de tipo 'B'";
}
