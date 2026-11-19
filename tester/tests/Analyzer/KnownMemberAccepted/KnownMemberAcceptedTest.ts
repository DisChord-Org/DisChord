import { Test } from "../../../Test";

/**
 * @class KnownMemberAcceptedTest
 * @description Validates that it has to accept the members of the JavaScript class behind a value and any member on a union or cualquiera.
 */
export class KnownMemberAcceptedTest extends Test {
    /**
     * @type {string}
     */
    public readonly name: string = 'Known Member Accepted - Test';

    /**
     * @type {string}
     */
    public readonly description: string = "It has to accept the members of the JavaScript class behind a value and any member on a union or cualquiera";
}
