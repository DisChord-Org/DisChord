import { Test } from "../../../Test";

/**
 * @class MessageAuthorNameNotNumberTest
 * @description It has to type the name of the author of a message as a text
 */
export class MessageAuthorNameNotNumberTest extends Test {
    /**
     * @type {string}
     */
    public readonly name: string = 'Message Author Name Not Number - Test';

    /**
     * @type {string}
     */
    public readonly description: string = "It has to type the name of the author of a message as a text";

    /**
     * @type {string}
     */
    public readonly expectedError: string = "La variable 'n' se declaró con tipo 'numero' pero se le asignó un valor de tipo 'texto'";
}
