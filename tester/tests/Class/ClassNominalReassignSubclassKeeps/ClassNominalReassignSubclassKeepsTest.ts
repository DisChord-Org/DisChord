import { Test } from "../../../Test";

/**
 * @class ClassNominalReassignSubclassKeepsTest
 * @description Validates that reassigning an unannotated variable to a subclass keeps its type.
 */
export class ClassNominalReassignSubclassKeepsTest extends Test {
    /**
     * @type {string}
     */
    public readonly name: string = 'ClassNominal Reassign Subclass Keeps - Test';

    /**
     * @type {string}
     */
    public readonly description: string = "It has to keep the type of a variable reassigned to a subclass";

    /**
     * @type {string}
     */
    public readonly expectedError: string = "La variable 'b' se declaró con tipo 'B' pero se le asignó un valor de tipo 'A'";
}
