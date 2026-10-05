import { Test } from "../../../Test";

/**
 * @class VariableCoreLibReturnMismatchTest
 * @description Validates that a `tipo` annotation contradicting the return type of a core library call (`Mates.raizCuadrada` yields `numero`) is rejected during analysis.
 */
export class VariableCoreLibReturnMismatchTest extends Test {
    /**
     * @type {string}
     */
    public readonly name: string = 'Variable Core Lib Return Mismatch - Test';

    /**
     * @type {string}
     */
    public readonly description: string = "It has to reject a 'tipo' annotation that contradicts the declared return type of the core library member assigned to the variable";

    /**
     * @type {string}
     */
    public readonly expectedError: string = "se declaró con tipo 'texto' pero se le asignó un valor de tipo 'numero'";
}
