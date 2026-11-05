import { Test } from "../../../Test";

/**
 * @class MessageExtensionsNotImportedTest
 * @description It must not import the message extensions when an event reads no patched name of its message
 */
export class MessageExtensionsNotImportedTest extends Test {
    /**
     * @type {string}
     */
    public readonly name: string = 'Message Extensions Not Imported - Test';

    /**
     * @type {string}
     */
    public readonly description: string = "It must not import the message extensions when an event reads no patched name of its message";
}
