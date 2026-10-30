import { Test } from "../../../Test";

/**
 * @class TypedCommandOptionNumberMismatchTest
 * @description It has to reject a number option where a text is expected
 */
export class TypedCommandOptionNumberMismatchTest extends Test {
    /**
     * @type {string}
     */
    public readonly name: string = 'Typed Command Option Number Mismatch - Test';

    /**
     * @type {string}
     */
    public readonly description: string = "It has to reject a number option where a text is expected";

    /**
     * @type {string}
     */
    public readonly expectedError: string = "La variable 's' se declaró con tipo 'texto' pero se le asignó un valor de tipo 'numero'";
}
