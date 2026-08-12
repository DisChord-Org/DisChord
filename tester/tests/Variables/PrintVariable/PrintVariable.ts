import { Test } from "../../../Test";

/**
 * @class PrintVariable
 * @description Validates that DisChord print a variable
 */
export class PrintVariable extends Test {
    /**
     * @type {string}
     */
    public readonly name: string = 'Console - Test';
    
    /**
     * @type {string}
     */
    public readonly description: string = 'It has to print the information of a variable';
}