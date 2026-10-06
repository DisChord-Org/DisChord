import { Test } from "../../../Test";

/**
 * @class EventNameToStringTest
 * @description Validates that an event named `toString` is reported as unknown instead of being matched against the event table.
 */
export class EventNameToStringTest extends Test {
    /**
     * @type {string}
     */
    public readonly name: string = 'Event Name To String - Test';

    /**
     * @type {string}
     */
    public readonly description: string = "It has to reject an event named after an inherited object method as a nonexistent event";

    /**
     * @type {string}
     */
    public readonly expectedError: string = "El evento 'toString' no existe";
}
