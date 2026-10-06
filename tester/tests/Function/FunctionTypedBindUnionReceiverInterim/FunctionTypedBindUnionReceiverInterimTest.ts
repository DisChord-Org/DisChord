import { Test } from "../../../Test";

/**
 * @class FunctionTypedBindUnionReceiverInterimTest
 * @description Validates the provisional behavior for a union receiver, which has no single class: the member is resolved by name as for an unknown receiver (`includes`) until union receivers get their own resolution.
 */
export class FunctionTypedBindUnionReceiverInterimTest extends Test {
    /**
     * @type {string}
     */
    public readonly name: string = 'Function Typed Bind Union Receiver Interim - Test';

    /**
     * @type {string}
     */
    public readonly description: string = "It has to resolve a member called on a union typed parameter by name";
}
