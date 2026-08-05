import { Test } from "../../../Test";

/**
 * @class ExitLoopTest
 * @description Validates that DisChord correctly extracts an array loop.
 */
export class ExitLoopTest extends Test {
    /**
     * @type {string}
     */
    public readonly name: string = 'Exit Loop - Test';
    
    /**
     * @type {string}
     */
    public readonly description: string = 'It has to generate the loop correctly';
}