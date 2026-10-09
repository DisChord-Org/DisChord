import { Test } from "../../../Test";

/**
 * @class ClassHierarchyCycleSelfTest
 * @description Validates that a class extending itself is rejected.
 */
export class ClassHierarchyCycleSelfTest extends Test {
    /**
     * @type {string}
     */
    public readonly name: string = 'Class Hierarchy Cycle Self - Test';

    /**
     * @type {string}
     */
    public readonly description: string = "It has to reject a class that extends itself";

    /**
     * @type {string}
     */
    public readonly expectedError: string = "La clase 'A' hereda de sí misma (A → A)";
}
