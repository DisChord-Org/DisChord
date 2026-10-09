import { Test } from "../../../Test";

/**
 * @class ClassNominalThisTest
 * @description Validates that `esta` inside a subclass is assignable to its base.
 */
export class ClassNominalThisTest extends Test {
    /**
     * @type {string}
     */
    public readonly name: string = 'ClassNominal This - Test';

    /**
     * @type {string}
     */
    public readonly description: string = "It has to accept esta where the base class is expected";
}
