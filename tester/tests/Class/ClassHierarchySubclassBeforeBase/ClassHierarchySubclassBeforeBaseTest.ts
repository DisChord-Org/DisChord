import { Test } from "../../../Test";

/**
 * @class ClassHierarchySubclassBeforeBaseTest
 * @description Validates that a class declared before the class it extends is rejected.
 */
export class ClassHierarchySubclassBeforeBaseTest extends Test {
    /**
     * @type {string}
     */
    public readonly name: string = 'Class Hierarchy Subclass Before Base - Test';

    /**
     * @type {string}
     */
    public readonly description: string = "It has to reject a subclass declared before its base";

    /**
     * @type {string}
     */
    public readonly expectedError: string = "La clase 'B' extiende de 'A', que se declara más abajo; declara 'A' antes de 'B'";
}
