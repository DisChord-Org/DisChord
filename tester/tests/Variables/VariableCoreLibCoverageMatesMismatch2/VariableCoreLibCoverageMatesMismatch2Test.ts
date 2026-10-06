import { Test } from "../../../Test";

/**
 * @class VariableCoreLibCoverageMatesMismatch2Test
 * @description Validates that a `tipo` annotation contradicting the return type of `Mates` static methods and constants is rejected during analysis.
 */
export class VariableCoreLibCoverageMatesMismatch2Test extends Test {
    /**
     * @type {string}
     */
    public readonly name: string = 'Variable Core Lib Coverage Mates Mismatch2 - Test';

    /**
     * @type {string}
     */
    public readonly description: string = "It has to reject a 'tipo' annotation that contradicts the return type of `Mates` static methods and constants";

    /**
     * @type {string}
     */
    public readonly expectedError: string = "se declaró con tipo 'booleano'";
}
