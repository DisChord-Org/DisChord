import { Test } from "../../../Test";

/**
 * @class AccessRoleCallStillRewrittenTest
 * @description Validates that a call on a receiver of unknown type is still rewritten to the core library method.
 */
export class AccessRoleCallStillRewrittenTest extends Test {
    /**
     * @type {string}
     */
    public readonly name: string = 'Access Role Call Still Rewritten - Test';

    /**
     * @type {string}
     */
    public readonly description: string = "It has to keep rewriting a method called on an untyped receiver";
}
