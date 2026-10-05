import { Test } from "../../../Test";

/**
 * @class VariableVoidAssignmentTest
 * @description Validates that using the result of a call that returns no value (`consola.imprimir`) as a variable's initializer is rejected during analysis.
 */
export class VariableVoidAssignmentTest extends Test {
    /**
     * @type {string}
     */
    public readonly name: string = 'Variable Void Assignment - Test';

    /**
     * @type {string}
     */
    public readonly description: string = "It has to reject initializing a variable with a call that produces no value";

    /**
     * @type {string}
     */
    public readonly expectedError: string = "se inicializó con una llamada que no devuelve ningún valor";
}
