import { Test } from "../../../Test";

/**
 * @class ClassHierarchyCycleChainTest
 * @description Validates that a cycle through three classes is rejected.
 */
export class ClassHierarchyCycleChainTest extends Test {
    /**
     * @type {string}
     */
    public readonly name: string = 'Class Hierarchy Cycle Chain - Test';

    /**
     * @type {string}
     */
    public readonly description: string = "It has to reject an inheritance cycle through three classes";

    /**
     * @type {string}
     */
    public readonly expectedError: string = "La clase 'A' hereda de sí misma (A → B → C → A)";
}
