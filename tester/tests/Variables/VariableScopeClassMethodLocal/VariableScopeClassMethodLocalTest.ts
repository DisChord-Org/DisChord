import { Test } from "../../../Test";

/**
 * @class VariableScopeClassMethodLocalTest
 * @description Validates that a local variable of a class method is typed and checked within the method.
 */
export class VariableScopeClassMethodLocalTest extends Test {
    /**
     * @type {string}
     */
    public readonly name: string = 'Variable Scope Class Method Local - Test';

    /**
     * @type {string}
     */
    public readonly description: string = "It has to reject a reassignment, inside a class method, that contradicts the declared type of a local variable";

    /**
     * @type {string}
     */
    public readonly expectedError: string = "La variable 'total' es de tipo 'numero'";
}
