import { Test } from "../../../Test";

/**
 * @class ClassNominalWrongArgTest
 * @description Validates that an instance of an unrelated class is rejected where another class is expected.
 */
export class ClassNominalWrongArgTest extends Test {
    /**
     * @type {string}
     */
    public readonly name: string = 'ClassNominal Wrong Arg - Test';

    /**
     * @type {string}
     */
    public readonly description: string = "It has to reject an argument of an unrelated class";

    /**
     * @type {string}
     */
    public readonly expectedError: string = "El argumento 1 de 'f' es de tipo 'B', se esperaba 'A'";
}
