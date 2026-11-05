import { Test } from "../../../Test";

/**
 * @class MessageContentNotNumberTest
 * @description It has to reject the content of a message, a text, where a number is expected
 */
export class MessageContentNotNumberTest extends Test {
    /**
     * @type {string}
     */
    public readonly name: string = 'Message Content Not Number - Test';

    /**
     * @type {string}
     */
    public readonly description: string = "It has to reject the content of a message, a text, where a number is expected";

    /**
     * @type {string}
     */
    public readonly expectedError: string = "La variable 'n' se declaró con tipo 'numero' pero se le asignó un valor de tipo 'texto'";
}
