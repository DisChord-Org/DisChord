import { Test } from "../../../Test";

/**
 * @class ClassHierarchyCycleDirectTest
 * @description Validates that two classes extending each other are rejected.
 */
export class ClassHierarchyCycleDirectTest extends Test {
    /**
     * @type {string}
     */
    public readonly name: string = 'Class Hierarchy Cycle Direct - Test';

    /**
     * @type {string}
     */
    public readonly description: string = "It has to reject a direct inheritance cycle";

    /**
     * @type {string}
     */
    public readonly expectedError: string = "La clase 'A' hereda de sí misma (A → B → A)";
}
