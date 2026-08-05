import { Test } from "../../../Test";

/**
 * @class BDOIWithCodeTest
 * @description Validates that DisChord correctly extracts a single BDOI IIFF with code definition.
 */
export class BDOIWithCodeTest extends Test {
    /**
     * @type {string}
     */
    public readonly name: string = 'Intelligent BDO & Code Definition - Test';
    
    /**
     * @type {string}
     */
    public readonly description: string = 'It has to detect the block as a Intelligent BDO with code definition';
}