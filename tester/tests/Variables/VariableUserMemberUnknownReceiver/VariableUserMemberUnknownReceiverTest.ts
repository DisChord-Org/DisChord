import { Test } from "../../../Test";

/**
 * @class VariableUserMemberUnknownReceiverTest
 * @description Validates that a method a class of the file declares keeps its name when called on a receiver of unknown type, instead of being rewritten to the core library member of the same name.
 */
export class VariableUserMemberUnknownReceiverTest extends Test {
    /**
     * @type {string}
     */
    public readonly name: string = 'Variable User Member Unknown Receiver - Test';

    /**
     * @type {string}
     */
    public readonly description: string = "It has to emit a user declared method name untouched on a receiver of unknown type";
}
