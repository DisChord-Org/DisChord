import { Test } from "../../../Test";

/**
 * @class AccessRolePropertyReadStillRewrittenTest
 * @description Validates that a core library property read on a receiver of unknown type is still rewritten to the core library member (through the runtime helper that picks at run time).
 */
export class AccessRolePropertyReadStillRewrittenTest extends Test {
    /**
     * @type {string}
     */
    public readonly name: string = 'Access Role Property Read Still Rewritten - Test';

    /**
     * @type {string}
     */
    public readonly description: string = "It has to keep rewriting a property read on an untyped receiver";
}
