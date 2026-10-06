import { Test } from "../../../Test";

/**
 * @class VariableCoreLibCoverageNumeroMismatch2Test
 * @description Validates that a `tipo` annotation contradicting the return type of `Numero` static and instance members is rejected during analysis.
 */
export class VariableCoreLibCoverageNumeroMismatch2Test extends Test {
    /**
     * @type {string}
     */
    public readonly name: string = 'Variable Core Lib Coverage Numero Mismatch2 - Test';

    /**
     * @type {string}
     */
    public readonly description: string = "It has to reject a 'tipo' annotation that contradicts the return type of `Numero` static and instance members";

    /**
     * @type {string}
     */
    public readonly expectedError: string = "se declaró con tipo 'numero'";
}
