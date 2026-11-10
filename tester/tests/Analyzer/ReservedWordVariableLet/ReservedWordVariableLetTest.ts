import { Test } from "../../../Test";

/**
 * @class ReservedWordVariableLetTest
 * @description It has to reject a variable named let, reserved in strict mode
 */
export class ReservedWordVariableLetTest extends Test {
    /**
     * @type {string}
     */
    public readonly name: string = 'Reserved Word Variable Let - Test';

    /**
     * @type {string}
     */
    public readonly description: string = "It has to reject a variable named let, reserved in strict mode";

    /**
     * @type {string}
     */
    public readonly expectedError: string = "No se puede declarar la variable 'let': es una palabra reservada de JavaScript";
}
