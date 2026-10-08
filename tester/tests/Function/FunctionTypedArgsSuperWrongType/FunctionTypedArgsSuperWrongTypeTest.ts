import { Test } from "../../../Test";

/**
 * @class FunctionTypedArgsSuperWrongTypeTest
 * @description Validates that `super(...)` is checked against the parent constructor.
 */
export class FunctionTypedArgsSuperWrongTypeTest extends Test {
    /**
     * @type {string}
     */
    public readonly name: string = 'FunctionTypedArgs Super Wrong Type - Test';

    /**
     * @type {string}
     */
    public readonly description: string = "It has to reject an argument of the wrong type in super";

    /**
     * @type {string}
     */
    public readonly expectedError: string = "El argumento 1 de 'A' es de tipo 'texto', se esperaba 'numero'";
}
