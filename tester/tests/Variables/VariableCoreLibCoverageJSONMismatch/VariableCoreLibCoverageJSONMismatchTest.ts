import { Test } from "../../../Test";

/**
 * @class VariableCoreLibCoverageJSONMismatchTest
 * @description Validates that a `tipo` annotation contradicting the return type of `JSON.escribir` is rejected during analysis.
 */
export class VariableCoreLibCoverageJSONMismatchTest extends Test {
    /**
     * @type {string}
     */
    public readonly name: string = 'Variable Core Lib Coverage JSONMismatch - Test';

    /**
     * @type {string}
     */
    public readonly description: string = "It has to reject a 'tipo' annotation that contradicts the return type of `JSON.escribir`";

    /**
     * @type {string}
     */
    public readonly expectedError: string = "se declaró con tipo 'numero'";
}
