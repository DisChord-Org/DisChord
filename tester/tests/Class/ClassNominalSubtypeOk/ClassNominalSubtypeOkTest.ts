import { Test } from "../../../Test";

/**
 * @class ClassNominalSubtypeOkTest
 * @description Validates that an instance of a subclass is accepted where its base is expected.
 */
export class ClassNominalSubtypeOkTest extends Test {
    /**
     * @type {string}
     */
    public readonly name: string = 'ClassNominal Subtype Ok - Test';

    /**
     * @type {string}
     */
    public readonly description: string = "It has to accept a subclass where its base is expected";
}
