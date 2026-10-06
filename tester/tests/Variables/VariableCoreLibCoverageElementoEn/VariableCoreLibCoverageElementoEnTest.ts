import { Test } from "../../../Test";

/**
 * @class VariableCoreLibCoverageElementoEnTest
 * @description Validates that `en` on `Texto` and `Lista` compiles when annotated with its declared return type.
 */
export class VariableCoreLibCoverageElementoEnTest extends Test {
    /**
     * @type {string}
     */
    public readonly name: string = 'Variable Core Lib Coverage Elemento En - Test';

    /**
     * @type {string}
     */
    public readonly description: string = "It has to compile variables initialized from `en` annotated with the matching return type";
}
