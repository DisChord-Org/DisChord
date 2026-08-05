import { Test } from "../../../Test";

/**
 * @class BDOLoopTest
 * @description Validates that DisChord correctly extracts an array loop.
 */
export class BDOLoopTest extends Test {
    /**
     * @type {string}
     */
    public readonly name: string = 'BDO Loop - Test';
    
    /**
     * @type {string}
     */
    public readonly description: string = 'It has to generate the loop correctly';
}