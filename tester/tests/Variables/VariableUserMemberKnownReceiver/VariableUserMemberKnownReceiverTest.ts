import { Test } from "../../../Test";

/**
 * @class VariableUserMemberKnownReceiverTest
 * @description Validates that a receiver of a known type decides: a text keeps using the core library member even when a class of the file declares a method of the same name.
 */
export class VariableUserMemberKnownReceiverTest extends Test {
    /**
     * @type {string}
     */
    public readonly name: string = 'Variable User Member Known Receiver - Test';

    /**
     * @type {string}
     */
    public readonly description: string = "It has to rewrite a core library member on a receiver of known type even if the file declares a member with that name";
}
