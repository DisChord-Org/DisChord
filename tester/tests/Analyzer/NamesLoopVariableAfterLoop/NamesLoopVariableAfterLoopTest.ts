import { Test } from "../../../Test";

/**
 * @class NamesLoopVariableAfterLoopTest
 * @description Validates that the variable of a loop is visible only while its body lasts.
 */
export class NamesLoopVariableAfterLoopTest extends Test {
    /**
     * @type {string}
     */
    public readonly name: string = 'Names Loop Variable After Loop - Test';

    /**
     * @type {string}
     */
    public readonly description: string = "It has to reject the variable of a loop used after the loop";

    /**
     * @type {string}
     */
    public readonly expectedError: string = "El nombre 'i' no está declarado.";
}
