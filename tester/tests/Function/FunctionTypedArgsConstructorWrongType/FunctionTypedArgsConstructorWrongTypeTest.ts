import { Test } from "../../../Test";

/**
 * @class FunctionTypedArgsConstructorWrongTypeTest
 * @description Validates that the arguments of a constructor are checked against its parameter types.
 */
export class FunctionTypedArgsConstructorWrongTypeTest extends Test {
    /**
     * @type {string}
     */
    public readonly name: string = 'Function Typed Args Constructor Wrong Type - Test';

    /**
     * @type {string}
     */
    public readonly description: string = "It has to reject an argument of another type in a constructor call";

    /**
     * @type {string}
     */
    public readonly expectedError: string = "El argumento 1 de 'Caja' es de tipo 'numero', se esperaba 'texto'";
}
