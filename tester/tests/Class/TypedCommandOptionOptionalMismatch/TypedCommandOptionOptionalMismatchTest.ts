import { Test } from "../../../Test";

/**
 * @class TypedCommandOptionOptionalMismatchTest
 * @description It has to reject an optional number option where a number is expected, since it can be undefined
 */
export class TypedCommandOptionOptionalMismatchTest extends Test {
    /**
     * @type {string}
     */
    public readonly name: string = 'Typed Command Option Optional Mismatch - Test';

    /**
     * @type {string}
     */
    public readonly description: string = "It has to reject an optional number option where a number is expected, since it can be undefined";

    /**
     * @type {string}
     */
    public readonly expectedError: string = "La variable 'n' se declaró con tipo 'numero' pero se le asignó un valor de tipo 'indefinido|numero'";
}
