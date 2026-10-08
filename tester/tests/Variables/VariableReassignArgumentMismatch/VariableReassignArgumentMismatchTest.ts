import { Test } from "../../../Test";

/**
 * @class VariableReassignArgumentMismatchTest
 * @description Validates that an argument of a variable that keeps its type is checked against the parameter type.
 */
export class VariableReassignArgumentMismatchTest extends Test {
    /**
     * @type {string}
     */
    public readonly name: string = 'VariableReassign Argument Mismatch - Test';

    /**
     * @type {string}
     */
    public readonly description: string = "It has to reject an argument whose variable still has another type";

    /**
     * @type {string}
     */
    public readonly expectedError: string = "El argumento 1 de 'f' es de tipo 'numero', se esperaba 'texto'";
}
