import { Test } from "../../../Test";

/**
 * @class EventRoleEditSignatureTest
 * @description It has to destructure the new and the previous role from the first argument of a role edited event
 */
export class EventRoleEditSignatureTest extends Test {
    /**
     * @type {string}
     */
    public readonly name: string = 'Event Role Edit Signature - Test';

    /**
     * @type {string}
     */
    public readonly description: string = "It has to destructure the new and the previous role from the first argument of a role edited event";
}
