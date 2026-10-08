import { Test } from "../../../Test";

/**
 * @class FunctionTypedArgsSuperInheritedConstructorTest
 * @description Validates that `super(...)` is checked against the constructor the parent itself inherits.
 */
export class FunctionTypedArgsSuperInheritedConstructorTest extends Test {
    /**
     * @type {string}
     */
    public readonly name: string = 'FunctionTypedArgs Super Inherited Constructor - Test';

    /**
     * @type {string}
     */
    public readonly description: string = "It has to check super against an inherited parent constructor";

    /**
     * @type {string}
     */
    public readonly expectedError: string = "El argumento 1 de 'B' es de tipo 'texto', se esperaba 'numero'";
}
