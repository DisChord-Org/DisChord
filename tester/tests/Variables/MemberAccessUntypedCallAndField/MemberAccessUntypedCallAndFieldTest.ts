import { Test } from "../../../Test";

/**
 * @class MemberAccessUntypedCallAndFieldTest
 * @description Pins that a call on an untyped receiver is rewritten while a field read is not.
 */
export class MemberAccessUntypedCallAndFieldTest extends Test {
    /**
     * @type {string}
     */
    public readonly name: string = 'Member Access Untyped Call And Field - Test';

    /**
     * @type {string}
     */
    public readonly description: string = "It has to rewrite the call and keep the field name";
}
