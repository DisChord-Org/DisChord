import { Test } from "../../../Test";

/**
 * @class ReturnAtTopLevelTest
 * @description It has to reject devolver outside a function, a command or an event
 */
export class ReturnAtTopLevelTest extends Test {
    /**
     * @type {string}
     */
    public readonly name: string = 'Return At Top Level - Test';

    /**
     * @type {string}
     */
    public readonly description: string = "It has to reject devolver outside a function, a command or an event";

    /**
     * @type {string}
     */
    public readonly expectedError: string = "'devolver' solo puede usarse dentro de una función, un comando o un evento.";
}
