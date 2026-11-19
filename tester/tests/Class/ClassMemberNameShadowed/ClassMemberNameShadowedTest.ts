import { Test } from "../../../Test";

/**
 * @class ClassMemberNameShadowedTest
 * @description Validates that a name of a member that something else takes (a parameter, a variable, a function of the file) is still that other thing.
 */
export class ClassMemberNameShadowedTest extends Test {
    /**
     * @type {string}
     */
    public readonly name: string = 'Class Member Name Shadowed - Test';

    /**
     * @type {string}
     */
    public readonly description: string = "It has to accept a parameter, a variable or a function named like a member";
}
