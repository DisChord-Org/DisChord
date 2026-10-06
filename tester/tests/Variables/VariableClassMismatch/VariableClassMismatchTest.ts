import { Test } from "../../../Test";

/**
 * @class VariableClassMismatchTest
 * @description Validates that annotating a variable with one core library class and instantiating a different one is rejected during analysis.
 */
export class VariableClassMismatchTest extends Test {
    /**
     * @type {string}
     */
    public readonly name: string = 'Variable Class Mismatch - Test';

    /**
     * @type {string}
     */
    public readonly description: string = "It has to reject a 'tipo' annotation naming a class different from the one instantiated";

    /**
     * @type {string}
     */
    public readonly expectedError: string = "se declaró con tipo 'Mapa' pero se le asignó un valor de tipo 'Conjunto'";
}
