import { Test } from "../../../Test";

/**
 * @class ClassNominalReassignDegradesTest
 * @description Validates that reassigning an unannotated variable to an unrelated class makes it cualquiera.
 */
export class ClassNominalReassignDegradesTest extends Test {
    /**
     * @type {string}
     */
    public readonly name: string = 'ClassNominal Reassign Degrades - Test';

    /**
     * @type {string}
     */
    public readonly description: string = "It has to accept using a variable reassigned to an unrelated class as any type";
}
