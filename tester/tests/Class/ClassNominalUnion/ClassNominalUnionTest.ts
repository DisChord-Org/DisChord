import { Test } from "../../../Test";

/**
 * @class ClassNominalUnionTest
 * @description Validates that a union holding a class accepts a subclass.
 */
export class ClassNominalUnionTest extends Test {
    /**
     * @type {string}
     */
    public readonly name: string = 'ClassNominal Union - Test';

    /**
     * @type {string}
     */
    public readonly description: string = "It has to accept a subclass in a union with its base";
}
