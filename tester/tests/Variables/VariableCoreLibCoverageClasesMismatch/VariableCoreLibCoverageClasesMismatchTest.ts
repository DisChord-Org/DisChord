import { Test } from "../../../Test";

/**
 * @class VariableCoreLibCoverageClasesMismatchTest
 * @description Validates that a `tipo` annotation contradicting the return type of `Mapa`, `Conjunto` and `Expresion` instance members is rejected during analysis.
 */
export class VariableCoreLibCoverageClasesMismatchTest extends Test {
    /**
     * @type {string}
     */
    public readonly name: string = 'Variable Core Lib Coverage Clases Mismatch - Test';

    /**
     * @type {string}
     */
    public readonly description: string = "It has to reject a 'tipo' annotation that contradicts the return type of `Mapa`, `Conjunto` and `Expresion` instance members";

    /**
     * @type {string}
     */
    public readonly expectedError: string = "se declaró con tipo 'numero'";
}
