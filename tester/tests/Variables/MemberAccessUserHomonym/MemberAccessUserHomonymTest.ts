import { Test } from "../../../Test";

/**
 * @class MemberAccessUserHomonymTest
 * @description Pins that a member the file declares wins over a core library one of the same name on an untyped receiver.
 */
export class MemberAccessUserHomonymTest extends Test {
    /**
     * @type {string}
     */
    public readonly name: string = 'Member Access User Homonym - Test';

    /**
     * @type {string}
     */
    public readonly description: string = "It has to keep the name of a member declared by the user";
}
