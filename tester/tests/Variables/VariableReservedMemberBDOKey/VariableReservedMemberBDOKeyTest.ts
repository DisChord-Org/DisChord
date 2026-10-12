import { Test } from "../../../Test";

/**
 * @class VariableReservedMemberBDOKeyTest
 * @description Validates that a reserved word can name a BDO property and be read back as a member, as in an object literal.
 */
export class VariableReservedMemberBDOKeyTest extends Test {
    /**
     * @type {string}
     */
    public readonly name: string = 'Variable Reserved Member BDO Key - Test';

    /**
     * @type {string}
     */
    public readonly description: string = "It has to accept a reserved word as a BDO key";

}
