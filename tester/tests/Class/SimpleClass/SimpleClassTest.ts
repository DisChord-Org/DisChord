import { Test } from "../../../Test";

/**
 * @class SimpleClassTest
 * @description Validates that DisChord correctly compiles class inheritance, constructors and methods.
 */
export class SimpleClassTest extends Test {
    /**
     * @type {string}
     */
    public readonly name: string = 'Simple Class - Test';

    /**
     * @type {string}
     */
    public readonly description: string = 'It has to generate a class with inheritance, a constructor and methods correctly';
}
