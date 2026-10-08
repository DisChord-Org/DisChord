import { Test } from "../../../Test";

/**
 * @class MemberAccessAnnotatedReturnTest
 * @description Pins how a call on the result of a function with an annotated return type is emitted.
 */
export class MemberAccessAnnotatedReturnTest extends Test {
    /**
     * @type {string}
     */
    public readonly name: string = 'Member Access Annotated Return - Test';

    /**
     * @type {string}
     */
    public readonly description: string = "It has to use the declared return type to pick the member";
}
