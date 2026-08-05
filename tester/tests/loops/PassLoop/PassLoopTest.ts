import { Test } from "../../../Test";

/**
 * @class PassLoopTest
 * @description Validates that the parser correctly extracts an array loop.
 */
export class PassLoopTest extends Test {
    /**
     * @type {string}
     */
    public readonly name: string = 'Pass Loop - Test';
    
    /**
     * @type {string}
     */
    public readonly description: string = 'It has to generate the loop correctly';
}