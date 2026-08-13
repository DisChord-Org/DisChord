import { Test } from "../../../Test";

/**
 * @class SimpleConditionTest
 * @description Validates that DisChord correctly compiles a basic si/sino conditional block.
 */
export class SimpleConditionTest extends Test {
    /**
     * @type {string}
     */
    public readonly name: string = 'Simple Condition - Test';

    /**
     * @type {string}
     */
    public readonly description: string = 'It has to generate a basic si/sino conditional correctly';
}
