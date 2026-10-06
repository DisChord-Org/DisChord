import { Test } from "../../../Test";

/**
 * @class VariableCoreLibCoverageTextoTest
 * @description Validates that variables initialized from `Texto` methods and `longitud` and annotated with the declared return type compile.
 */
export class VariableCoreLibCoverageTextoTest extends Test {
    /**
     * @type {string}
     */
    public readonly name: string = 'Variable Core Lib Coverage Texto - Test';

    /**
     * @type {string}
     */
    public readonly description: string = "It has to compile variables initialized from `Texto` methods and `longitud` annotated with the matching return type";
}
