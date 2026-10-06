import { Test } from "../../../Test";

/**
 * @class VariableCoreLibCoverageTextoMismatch2Test
 * @description Validates that a `tipo` annotation contradicting the return type of `Texto` methods and `longitud` is rejected during analysis.
 */
export class VariableCoreLibCoverageTextoMismatch2Test extends Test {
    /**
     * @type {string}
     */
    public readonly name: string = 'Variable Core Lib Coverage Texto Mismatch2 - Test';

    /**
     * @type {string}
     */
    public readonly description: string = "It has to reject a 'tipo' annotation that contradicts the return type of `Texto` methods and `longitud`";

    /**
     * @type {string}
     */
    public readonly expectedError: string = "se declaró con tipo 'texto'";
}
