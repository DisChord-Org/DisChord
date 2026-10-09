import { Test } from "../../../Test";

/**
 * @class DeclareMembersNamedLikeCoreLibTest
 * @description Validates that a method and a property of a class may be named like a class of the core library.
 */
export class DeclareMembersNamedLikeCoreLibTest extends Test {
    /**
     * @type {string}
     */
    public readonly name: string = 'Declare Members Named Like Core Lib - Test';

    /**
     * @type {string}
     */
    public readonly description: string = "It has to accept members named like core library classes";
}
