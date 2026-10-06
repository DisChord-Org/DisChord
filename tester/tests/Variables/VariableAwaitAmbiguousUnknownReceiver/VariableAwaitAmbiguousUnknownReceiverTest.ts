import { Test } from "../../../Test";

/**
 * @class VariableAwaitAmbiguousUnknownReceiverTest
 * @description Validates that a receiver of unknown type is not awaited when the classes declaring the method name disagree.
 */
export class VariableAwaitAmbiguousUnknownReceiverTest extends Test {
    /**
     * @type {string}
     */
    public readonly name: string = 'Variable Await Ambiguous Unknown Receiver - Test';

    /**
     * @type {string}
     */
    public readonly description: string = "It has to leave an untyped receiver call without await when only some classes declare the method async";
}
