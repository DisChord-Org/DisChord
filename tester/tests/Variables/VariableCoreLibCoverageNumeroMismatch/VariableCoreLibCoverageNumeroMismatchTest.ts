import { Test } from "../../../Test";

/**
 * @class VariableCoreLibCoverageNumeroMismatchTest
 * @description Validates that a `tipo` annotation contradicting the return type of `Numero` static and instance members is rejected during analysis.
 */
export class VariableCoreLibCoverageNumeroMismatchTest extends Test {
    /**
     * @type {string}
     */
    public readonly name: string = 'Variable Core Lib Coverage Numero Mismatch - Test';

    /**
     * @type {string}
     */
    public readonly description: string = "It has to reject a 'tipo' annotation that contradicts the return type of `Numero` static and instance members";

    /**
     * @type {string}
     */
    public readonly expectedError: string = "se declaró con tipo 'numero'";
}
