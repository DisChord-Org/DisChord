import { Test } from "../../../Test";

/**
 * @class VariableUserMemberUnknownReceiverPropertyTest
 * @description Validates that a property a class of the file declares keeps its name on a receiver of unknown type, the same as a method.
 */
export class VariableUserMemberUnknownReceiverPropertyTest extends Test {
    /**
     * @type {string}
     */
    public readonly name: string = 'Variable User Member Unknown Receiver Property - Test';

    /**
     * @type {string}
     */
    public readonly description: string = "It has to emit a user declared property name untouched on a receiver of unknown type";
}
