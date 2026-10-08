import { Test } from "../../../Test";

/**
 * @class VariableReassignGlobalFromFunctionTest
 * @description Validates that reassigning a global from a function with another type degrades it everywhere.
 */
export class VariableReassignGlobalFromFunctionTest extends Test {
    /**
     * @type {string}
     */
    public readonly name: string = 'VariableReassign Global From Function - Test';

    /**
     * @type {string}
     */
    public readonly description: string = "It has to degrade a global reassigned in a function with another type";
}
