import { Test } from "../../../Test";

/**
 * @class EventNameValidTest
 * @description Validates that an event the table knows keeps compiling.
 */
export class EventNameValidTest extends Test {
    /**
     * @type {string}
     */
    public readonly name: string = 'Event Name Valid - Test';

    /**
     * @type {string}
     */
    public readonly description: string = "It has to compile an event whose name is in the event table";
}
