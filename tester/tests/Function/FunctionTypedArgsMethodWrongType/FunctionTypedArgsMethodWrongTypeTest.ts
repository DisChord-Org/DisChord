import { Test } from "../../../Test";

/**
 * @class FunctionTypedArgsMethodWrongTypeTest
 * @description Validates that the arguments of a method called through a typed receiver are checked.
 */
export class FunctionTypedArgsMethodWrongTypeTest extends Test {
    /**
     * @type {string}
     */
    public readonly name: string = 'Function Typed Args Method Wrong Type - Test';

    /**
     * @type {string}
     */
    public readonly description: string = "It has to reject an argument of another type in a method call";

    /**
     * @type {string}
     */
    public readonly expectedError: string = "El argumento 1 de 'pesar' es de tipo 'texto', se esperaba 'numero'";
}
