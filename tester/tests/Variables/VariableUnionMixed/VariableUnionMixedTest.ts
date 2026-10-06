import { Test } from "../../../Test";

/**
 * @class VariableUnionMixedTest
 * @description Validates that a union of a primitive, a core library class and a list (`texto|Mapa|Lista`) accepts a value of each member.
 */
export class VariableUnionMixedTest extends Test {
    /**
     * @type {string}
     */
    public readonly name: string = 'Variable Union Mixed - Test';

    /**
     * @type {string}
     */
    public readonly description: string = "It has to accept values of every member of a mixed union";
}
