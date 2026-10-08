import { Test } from "../../../Test";

/**
 * @class MemberAccessWriteTest
 * @description Pins that writing to a member of an untyped receiver keeps its name.
 */
export class MemberAccessWriteTest extends Test {
    /**
     * @type {string}
     */
    public readonly name: string = 'Member Access Write - Test';

    /**
     * @type {string}
     */
    public readonly description: string = "It has to not rewrite the target of an assignment";
}
