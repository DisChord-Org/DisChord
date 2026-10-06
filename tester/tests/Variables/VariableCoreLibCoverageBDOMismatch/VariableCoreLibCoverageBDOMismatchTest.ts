import { Test } from "../../../Test";

/**
 * @class VariableCoreLibCoverageBDOMismatchTest
 * @description Validates that a `tipo` annotation contradicting the return type of `BDO` static methods is rejected during analysis.
 */
export class VariableCoreLibCoverageBDOMismatchTest extends Test {
    /**
     * @type {string}
     */
    public readonly name: string = 'Variable Core Lib Coverage BDOMismatch - Test';

    /**
     * @type {string}
     */
    public readonly description: string = "It has to reject a 'tipo' annotation that contradicts the return type of `BDO` static methods";

    /**
     * @type {string}
     */
    public readonly expectedError: string = "se declaró con tipo 'texto'";
}
