import { Test } from "../../../Test";

/**
 * @class TypedEventParamMismatchTest
 * @description It has to reject assigning the name of a user, a text, to a number
 */
export class TypedEventParamMismatchTest extends Test {
    /**
     * @type {string}
     */
    public readonly name: string = 'Typed Event Param Mismatch - Test';

    /**
     * @type {string}
     */
    public readonly description: string = "It has to reject assigning the name of a user, a text, to a number";

    /**
     * @type {string}
     */
    public readonly expectedError: string = "La variable 'n' se declaró con tipo 'numero' pero se le asignó un valor de tipo 'texto'";
}
