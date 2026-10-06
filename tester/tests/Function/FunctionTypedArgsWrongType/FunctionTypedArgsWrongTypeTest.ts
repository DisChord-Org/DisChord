import { Test } from "../../../Test";

/**
 * @class FunctionTypedArgsWrongTypeTest
 * @description Validates that an argument contradicting the declared parameter type is rejected.
 */
export class FunctionTypedArgsWrongTypeTest extends Test {
    /**
     * @type {string}
     */
    public readonly name: string = 'Function Typed Args Wrong Type - Test';

    /**
     * @type {string}
     */
    public readonly description: string = "It has to reject an argument of another type than the parameter";

    /**
     * @type {string}
     */
    public readonly expectedError: string = "El argumento 1 de 'hayEn' es de tipo 'texto', se esperaba 'Mapa'";
}
