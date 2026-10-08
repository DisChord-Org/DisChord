import { Test } from "../../../Test";

/**
 * @class MemberAccessStaticsTest
 * @description Pins that static core library accesses are emitted as before.
 */
export class MemberAccessStaticsTest extends Test {
    /**
     * @type {string}
     */
    public readonly name: string = 'Member Access Statics - Test';

    /**
     * @type {string}
     */
    public readonly description: string = "It has to emit static members directly";
}
