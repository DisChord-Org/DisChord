import { Test } from "../../../Test";

/**
 * @class AccessRoleMethodAsValueTest
 * @description Validates that a method name used as a value, without calling it, is not rewritten on a receiver of unknown type.
 */
export class AccessRoleMethodAsValueTest extends Test {
    /**
     * @type {string}
     */
    public readonly name: string = 'Access Role Method As Value - Test';

    /**
     * @type {string}
     */
    public readonly description: string = "It has to emit a method name untouched when it is read without being called on an untyped receiver";
}
