import { Test } from "../../../Test";

/**
 * @class LoopVariableObjectKeyTest
 * @description Validates that the variable of a loop over an object is a text, the name of each key.
 */
export class LoopVariableObjectKeyTest extends Test {
    /**
     * @type {string}
     */
    public readonly name: string = 'Loop Variable Object Key - Test';

    /**
     * @type {string}
     */
    public readonly description: string = "It has to type the variable of a loop over a bdo as a text";

    /**
     * @type {string}
     */
    public readonly expectedError: string = "se le asignó un valor de tipo 'texto'";
}
