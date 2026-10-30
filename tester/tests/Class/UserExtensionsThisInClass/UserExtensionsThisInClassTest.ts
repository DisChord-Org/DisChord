import { Test } from "../../../Test";

/**
 * @class UserExtensionsThisInClassTest
 * @description It must not import the user extensions for a patched name on an object of the file
 */
export class UserExtensionsThisInClassTest extends Test {
    /**
     * @type {string}
     */
    public readonly name: string = 'User Extensions This In Class - Test';

    /**
     * @type {string}
     */
    public readonly description: string = "It must not import the user extensions for esta.nombre in a class of a file with Discord context";
}
