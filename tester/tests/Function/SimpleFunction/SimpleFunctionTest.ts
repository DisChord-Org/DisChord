import { Test } from "../../../Test";

/**
 * @class SimpleFunctionTest
 * @description Validates that DisChord correctly compiles a function declaration, its parameters and return statement.
 */
export class SimpleFunctionTest extends Test {
    /**
     * @type {string}
     */
    public readonly name: string = 'Simple Function - Test';

    /**
     * @type {string}
     */
    public readonly description: string = 'It has to generate a function declaration with a return statement correctly';
}
