import { Test } from "../../../Test";

/**
 * @class VariableCoreLibCoverageNumeroTest
 * @description Validates that variables initialized from `Numero` static and instance members and annotated with the declared return type compile.
 */
export class VariableCoreLibCoverageNumeroTest extends Test {
    /**
     * @type {string}
     */
    public readonly name: string = 'Variable Core Lib Coverage Numero - Test';

    /**
     * @type {string}
     */
    public readonly description: string = "It has to compile variables initialized from `Numero` static and instance members annotated with the matching return type";
}
