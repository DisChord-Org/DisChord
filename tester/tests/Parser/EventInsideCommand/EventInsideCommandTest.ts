import { Test } from "../../../Test";

/**
 * @class EventInsideCommandTest
 * @description It has to reject an event declared inside a command
 */
export class EventInsideCommandTest extends Test {
    /**
     * @type {string}
     */
    public readonly name: string = 'Event Inside Command - Test';

    /**
     * @type {string}
     */
    public readonly description: string = "It has to reject an event declared inside a command";

    /**
     * @type {string}
     */
    public readonly expectedError: string = "'evento' solo puede declararse en el nivel superior del archivo";
}
