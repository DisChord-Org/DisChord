import { Test } from "../../../Test";

/**
 * @class ReservedWordFunctionEvalTest
 * @description It has to reject a function named eval
 */
export class ReservedWordFunctionEvalTest extends Test {
    /**
     * @type {string}
     */
    public readonly name: string = 'Reserved Word Function Eval - Test';

    /**
     * @type {string}
     */
    public readonly description: string = "It has to reject a function named eval";

    /**
     * @type {string}
     */
    public readonly expectedError: string = "No se puede declarar la función 'eval': es una palabra reservada de JavaScript";
}
