import { Test } from "../../../Test";

/**
 * @class ClassNominalSupertypeIntoSubtypeErrorTest
 * @description Validates that a base instance is rejected where its subclass is expected.
 */
export class ClassNominalSupertypeIntoSubtypeErrorTest extends Test {
    /**
     * @type {string}
     */
    public readonly name: string = 'ClassNominal Supertype Into Subtype Error - Test';

    /**
     * @type {string}
     */
    public readonly description: string = "It has to reject a base instance where a subclass is expected";

    /**
     * @type {string}
     */
    public readonly expectedError: string = "La variable 'b' se declaró con tipo 'B' pero se le asignó un valor de tipo 'A'";
}
