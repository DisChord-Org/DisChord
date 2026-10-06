import { Test } from "../../../Test";

/**
 * @class FunctionTypedUnionMissingMemberTest
 * @description Validates that a union with a member lacking the method (`texto|numero` and `limpiar`) keeps the unknown-receiver behavior and uses no helper.
 */
export class FunctionTypedUnionMissingMemberTest extends Test {
    /**
     * @type {string}
     */
    public readonly name: string = 'Function Typed Union Missing Member - Test';

    /**
     * @type {string}
     */
    public readonly description: string = "It has to leave a call alone when a class of the union lacks the method";
}
