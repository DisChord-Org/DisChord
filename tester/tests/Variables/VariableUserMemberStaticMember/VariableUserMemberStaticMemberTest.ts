import { Test } from "../../../Test";

/**
 * @class VariableUserMemberStaticMemberTest
 * @description Validates that a static core library member is unaffected by a class of the file declaring a member of the same name.
 */
export class VariableUserMemberStaticMemberTest extends Test {
    /**
     * @type {string}
     */
    public readonly name: string = 'Variable User Member Static Member - Test';

    /**
     * @type {string}
     */
    public readonly description: string = "It has to keep rewriting a static core library member when the file declares a member with that name";
}
