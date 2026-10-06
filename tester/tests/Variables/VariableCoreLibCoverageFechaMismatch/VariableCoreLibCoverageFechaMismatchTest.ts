import { Test } from "../../../Test";

/**
 * @class VariableCoreLibCoverageFechaMismatchTest
 * @description Validates that a `tipo` annotation contradicting the return type of a `Fecha` member is rejected during analysis.
 */
export class VariableCoreLibCoverageFechaMismatchTest extends Test {
    /**
     * @type {string}
     */
    public readonly name: string = 'Variable Core Lib Coverage Fecha Mismatch - Test';

    /**
     * @type {string}
     */
    public readonly description: string = "It has to reject a 'tipo' annotation that contradicts the return type of a `Fecha` member";

    /**
     * @type {string}
     */
    public readonly expectedError: string = "se declaró con tipo 'texto'";
}
