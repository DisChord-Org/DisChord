import { Test } from "../../../Test";

/**
 * @class MemberAccessTextTest
 * @description Pins how members of a texto receiver are emitted.
 */
export class MemberAccessTextTest extends Test {
    /**
     * @type {string}
     */
    public readonly name: string = 'Member Access Text - Test';

    /**
     * @type {string}
     */
    public readonly description: string = "It has to emit texto members through the core library";
}
