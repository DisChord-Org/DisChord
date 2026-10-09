import { Test } from "../../../Test";

/**
 * @class ClassNominalIndirectTest
 * @description Validates that a class two levels down is assignable to its grandparent.
 */
export class ClassNominalIndirectTest extends Test {
    /**
     * @type {string}
     */
    public readonly name: string = 'ClassNominal Indirect - Test';

    /**
     * @type {string}
     */
    public readonly description: string = "It has to accept an indirect subclass";
}
