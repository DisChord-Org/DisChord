import { Test } from "../../../Test";

/**
 * @class VariableCoreLibCoverageMatesTest
 * @description Validates that variables initialized from `Mates` static methods and constants and annotated with the declared return type compile.
 */
export class VariableCoreLibCoverageMatesTest extends Test {
    /**
     * @type {string}
     */
    public readonly name: string = 'Variable Core Lib Coverage Mates - Test';

    /**
     * @type {string}
     */
    public readonly description: string = "It has to compile variables initialized from `Mates` static methods and constants annotated with the matching return type";
}
