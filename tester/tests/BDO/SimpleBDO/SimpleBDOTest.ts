import { Test } from "../../../Test";

/**
 * @class SimpleBDOTest
 * @description Validates that DisChord correctly extracts a single BDO variable mapping.
 */
export class SimpleBDOTest extends Test {
    /**
     * @type {string}
     */
    public readonly name: string = 'Simple BDO - Test';
    
    /**
     * @type {string}
     */
    public readonly description: string = 'It has to detect the block as a simple BDO';
}