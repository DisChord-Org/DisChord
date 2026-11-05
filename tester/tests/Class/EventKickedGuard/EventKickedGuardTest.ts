import { Test } from "../../../Test";

/**
 * @class EventKickedGuardTest
 * @description It has to ignore an unavailable server in a kicked event and expose its server id
 */
export class EventKickedGuardTest extends Test {
    /**
     * @type {string}
     */
    public readonly name: string = 'Event Kicked Guard - Test';

    /**
     * @type {string}
     */
    public readonly description: string = "It has to ignore an unavailable server in a kicked event and expose its server id";
}
