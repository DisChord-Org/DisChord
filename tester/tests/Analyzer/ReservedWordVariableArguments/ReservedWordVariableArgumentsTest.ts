import { Test } from "../../../Test";

/**
 * @class ReservedWordVariableArgumentsTest
 * @description It has to reject a variable named arguments, which strict mode does not let be declared
 */
export class ReservedWordVariableArgumentsTest extends Test {
    /**
     * @type {string}
     */
    public readonly name: string = 'Reserved Word Variable Arguments - Test';

    /**
     * @type {string}
     */
    public readonly description: string = "It has to reject a variable named arguments, which strict mode does not let be declared";

    /**
     * @type {string}
     */
    public readonly expectedError: string = "No se puede declarar la variable 'arguments': es una palabra reservada de JavaScript";
}
