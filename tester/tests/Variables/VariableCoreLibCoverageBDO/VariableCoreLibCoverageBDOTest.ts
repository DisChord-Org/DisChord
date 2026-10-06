import { Test } from "../../../Test";

/**
 * @class VariableCoreLibCoverageBDOTest
 * @description Validates that variables initialized from `BDO` static methods and annotated with the declared return type compile.
 */
export class VariableCoreLibCoverageBDOTest extends Test {
    /**
     * @type {string}
     */
    public readonly name: string = 'Variable Core Lib Coverage BDO - Test';

    /**
     * @type {string}
     */
    public readonly description: string = "It has to compile variables initialized from `BDO` static methods annotated with the matching return type";
}
