import { Test } from "../../../Test";

/**
 * @class VariableCoreLibCoverageJSONTest
 * @description Validates that variables initialized from `JSON.escribir` and annotated with the declared return type compile.
 */
export class VariableCoreLibCoverageJSONTest extends Test {
    /**
     * @type {string}
     */
    public readonly name: string = 'Variable Core Lib Coverage JSON - Test';

    /**
     * @type {string}
     */
    public readonly description: string = "It has to compile variables initialized from `JSON.escribir` annotated with the matching return type";
}
