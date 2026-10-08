import { Test } from "../../../Test";

/**
 * @class VariableReassignShadowNotDegradedTest
 * @description Validates that a local variable of another type that shadows a global does not degrade the global.
 */
export class VariableReassignShadowNotDegradedTest extends Test {
    /**
     * @type {string}
     */
    public readonly name: string = 'VariableReassign Shadow Not Degraded - Test';

    /**
     * @type {string}
     */
    public readonly description: string = "It has to keep the type of a global when a local of the same name has another type";

    /**
     * @type {string}
     */
    public readonly expectedError: string = "La variable 'k' se declaró con tipo 'texto' pero se le asignó un valor de tipo 'numero'";
}
