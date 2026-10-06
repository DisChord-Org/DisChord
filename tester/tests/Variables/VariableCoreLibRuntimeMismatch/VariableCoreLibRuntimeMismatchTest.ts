import { Test } from "../../../Test";

/**
 * @class VariableCoreLibRuntimeMismatchTest
 * @description Validates that a `tipo` annotation contradicting the return type of a runtime helper is rejected during analysis.
 */
export class VariableCoreLibRuntimeMismatchTest extends Test {
    /**
     * @type {string}
     */
    public readonly name: string = 'Variable Core Lib Runtime Mismatch - Test';

    /**
     * @type {string}
     */
    public readonly description: string = "It has to reject a 'tipo' annotation that contradicts the return type of a runtime helper";

    /**
     * @type {string}
     */
    public readonly expectedError: string = "se declaró con tipo 'texto'";
}
