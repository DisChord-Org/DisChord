import { Test } from "../../../Test";

/**
 * @class VariableCoreLibCoverageListaMismatch2Test
 * @description Validates that a `tipo` annotation contradicting the return type of `Lista` methods and `longitud` is rejected during analysis.
 */
export class VariableCoreLibCoverageListaMismatch2Test extends Test {
    /**
     * @type {string}
     */
    public readonly name: string = 'Variable Core Lib Coverage Lista Mismatch2 - Test';

    /**
     * @type {string}
     */
    public readonly description: string = "It has to reject a 'tipo' annotation that contradicts the return type of `Lista` methods and `longitud`";

    /**
     * @type {string}
     */
    public readonly expectedError: string = "se declaró con tipo 'numero'";
}
