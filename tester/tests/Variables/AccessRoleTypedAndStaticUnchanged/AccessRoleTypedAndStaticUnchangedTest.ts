import { Test } from "../../../Test";

/**
 * @class AccessRoleTypedAndStaticUnchangedTest
 * @description Validates that accesses on a typed receiver and static accesses keep resolving through the core library.
 */
export class AccessRoleTypedAndStaticUnchangedTest extends Test {
    /**
     * @type {string}
     */
    public readonly name: string = 'Access Role Typed And Static Unchanged - Test';

    /**
     * @type {string}
     */
    public readonly description: string = "It has to leave typed and static accesses unchanged";
}
