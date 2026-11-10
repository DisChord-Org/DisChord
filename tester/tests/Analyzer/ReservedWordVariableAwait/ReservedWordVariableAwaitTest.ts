import { Test } from "../../../Test";

/**
 * @class ReservedWordVariableAwaitTest
 * @description It has to reject a variable named await, reserved in modules
 */
export class ReservedWordVariableAwaitTest extends Test {
    /**
     * @type {string}
     */
    public readonly name: string = 'Reserved Word Variable Await - Test';

    /**
     * @type {string}
     */
    public readonly description: string = "It has to reject a variable named await, reserved in modules";

    /**
     * @type {string}
     */
    public readonly expectedError: string = "No se puede declarar la variable 'await': es una palabra reservada de JavaScript";
}
