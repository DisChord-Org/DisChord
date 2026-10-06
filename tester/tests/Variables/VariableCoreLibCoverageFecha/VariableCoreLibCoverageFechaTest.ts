import { Test } from "../../../Test";

/**
 * @class VariableCoreLibCoverageFechaTest
 * @description Validates that variables initialized from `Fecha` members and annotated with the declared return type compile.
 */
export class VariableCoreLibCoverageFechaTest extends Test {
    /**
     * @type {string}
     */
    public readonly name: string = 'Variable Core Lib Coverage Fecha - Test';

    /**
     * @type {string}
     */
    public readonly description: string = "It has to compile variables initialized from `Fecha` members annotated with the matching return type";
}
