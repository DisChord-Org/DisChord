import { Test } from "../../../Test";

/**
 * @class ReservedWordVariableClassTest
 * @description It has to reject a variable named with a reserved word of JavaScript
 */
export class ReservedWordVariableClassTest extends Test {
    /**
     * @type {string}
     */
    public readonly name: string = 'Reserved Word Variable Class - Test';

    /**
     * @type {string}
     */
    public readonly description: string = "It has to reject a variable named with a reserved word of JavaScript";

    /**
     * @type {string}
     */
    public readonly expectedError: string = "No se puede declarar la variable 'class': es una palabra reservada de JavaScript";
}
