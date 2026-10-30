import { Test } from "../../../Test";

/**
 * @class LoopVariableReassignedTest
 * @description Validates that a loop variable reassigned to another type becomes `cualquiera`, like any variable without an annotation.
 */
export class LoopVariableReassignedTest extends Test {
    /**
     * @type {string}
     */
    public readonly name: string = 'Loop Variable Reassigned - Test';

    /**
     * @type {string}
     */
    public readonly description: string = "It has to degrade a loop variable reassigned to another type";
}
