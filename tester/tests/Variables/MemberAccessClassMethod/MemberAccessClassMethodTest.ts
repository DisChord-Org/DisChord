import { Test } from "../../../Test";

/**
 * @class MemberAccessClassMethodTest
 * @description Pins how members are emitted inside a class method.
 */
export class MemberAccessClassMethodTest extends Test {
    /**
     * @type {string}
     */
    public readonly name: string = 'Member Access Class Method - Test';

    /**
     * @type {string}
     */
    public readonly description: string = "It has to emit esta members and core library members in a method";
}
