import { Test } from "../../../Test";

/**
 * @class AccessRoleFieldReadTest
 * @description Validates that a core library name read as a field of a receiver of unknown type is left as the user wrote it, as an argument, in a declaration, a condition and a return.
 */
export class AccessRoleFieldReadTest extends Test {
    /**
     * @type {string}
     */
    public readonly name: string = 'Access Role Field Read - Test';

    /**
     * @type {string}
     */
    public readonly description: string = "It has to emit a core library member name untouched when it is read as a field of an untyped receiver";
}
