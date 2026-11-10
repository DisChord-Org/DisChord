import { Test } from "../../../Test";

/**
 * @class NoValueInConditionTest
 * @description Validates that a call that returns no value is rejected as a condition.
 */
export class NoValueInConditionTest extends Test {
    /**
     * @type {string}
     */
    public readonly name: string = 'No Value In Condition - Test';

    /**
     * @type {string}
     */
    public readonly description: string = "It has to reject a call that returns no value as a condition";

    /**
     * @type {string}
     */
    public readonly expectedError: string = "'g' no devuelve ningún valor, no se puede usar como condición";
}
