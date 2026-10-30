import { Test } from "../../../Test";

/**
 * @class UserExtensionsHelperFunctionTest
 * @description It has to import the user extensions when a helper reads a patched name and an event exists
 */
export class UserExtensionsHelperFunctionTest extends Test {
    /**
     * @type {string}
     */
    public readonly name: string = 'User Extensions Helper Function - Test';

    /**
     * @type {string}
     */
    public readonly description: string = "It has to import the user extensions when a helper reads a patched name and an event exists";
}
