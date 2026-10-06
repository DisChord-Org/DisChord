import { Test } from "../../../Test";

/**
 * @class EventNameConstructorTest
 * @description Validates that an event named after a member `Object.prototype` provides (`constructor`) is reported as unknown instead of being matched against the event table.
 */
export class EventNameConstructorTest extends Test {
    /**
     * @type {string}
     */
    public readonly name: string = 'Event Name Constructor - Test';

    /**
     * @type {string}
     */
    public readonly description: string = "It has to reject an event whose name is an inherited object member as a nonexistent event";

    /**
     * @type {string}
     */
    public readonly expectedError: string = "El evento 'constructor' no existe";
}
