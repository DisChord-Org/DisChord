import { Test } from "../../../Test";

/**
 * @class LoopVariableTextTest
 * @description Validates that the variable of a loop over a text is a text.
 */
export class LoopVariableTextTest extends Test {
    /**
     * @type {string}
     */
    public readonly name: string = 'Loop Variable Text - Test';

    /**
     * @type {string}
     */
    public readonly description: string = "It has to type the variable of a loop over a text as a text";

    /**
     * @type {string}
     */
    public readonly expectedError: string = "se le asignó un valor de tipo 'texto'";
}
