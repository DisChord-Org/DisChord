import { Test } from "../../../Test";

/**
 * @class ArrayLoopTest
 * @description Validates that DisChord correctly extracts an array loop.
 */
export class ArrayLoopTest extends Test {
    /**
     * @type {string}
     */
    public readonly name: string = 'Array Loop - Test';
    
    /**
     * @type {string}
     */
    public readonly description: string = 'It has to generate the loop correctly';
}