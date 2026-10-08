import { Test } from "../../../Test";

/**
 * @class MemberAccessChainedTest
 * @description Pins how chained accesses are emitted.
 */
export class MemberAccessChainedTest extends Test {
    /**
     * @type {string}
     */
    public readonly name: string = 'Member Access Chained - Test';

    /**
     * @type {string}
     */
    public readonly description: string = "It has to keep field names in chained accesses and rewrite calls";
}
