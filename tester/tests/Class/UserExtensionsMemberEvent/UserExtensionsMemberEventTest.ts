import { Test } from "../../../Test";

/**
 * @class UserExtensionsMemberEventTest
 * @description It has to import the user extensions when an event reads a patched name of its member
 */
export class UserExtensionsMemberEventTest extends Test {
    /**
     * @type {string}
     */
    public readonly name: string = 'User Extensions Member Event - Test';

    /**
     * @type {string}
     */
    public readonly description: string = "It has to import the user extensions when an event reads a patched name of its member";
}
