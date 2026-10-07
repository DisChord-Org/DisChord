import { Test } from "../../../Test";

/**
 * @class AccessRolePropertyReadStillRewrittenTest
 * @description Validates that a core library property read on a receiver of unknown type is still rewritten (the dispatch of `longitud` is left for later).
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
