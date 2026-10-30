import { Test } from "../../../Test";

/**
 * @class UserExtensionsPlainObjectTest
 * @description It must not import the user extensions for a patched name on an object of the file
 */
export class UserExtensionsPlainObjectTest extends Test {
    /**
     * @type {string}
     */
    public readonly name: string = 'User Extensions Plain Object - Test';

    /**
     * @type {string}
     */
    public readonly description: string = "It must not import the user extensions for a patched name on an object of the file";
}
