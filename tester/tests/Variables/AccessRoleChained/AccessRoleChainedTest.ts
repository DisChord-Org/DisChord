import { Test } from "../../../Test";

/**
 * @class AccessRoleChainedTest
 * @description Validates chained accesses: the callee and the property read of `p.partir(",").longitud` are rewritten, while in `p.dia.mes es 3` only the outer access is the assignment target and the inner one is a plain read of a field.
 */
export class AccessRoleChainedTest extends Test {
    /**
     * @type {string}
     */
    public readonly name: string = 'Access Role Chained - Test';

    /**
     * @type {string}
     */
    public readonly description: string = "It has to resolve the role of each access in a chain";
}
