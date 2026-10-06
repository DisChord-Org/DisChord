import { Test } from "../../../Test";

/**
 * @class VariableUserMemberUnknownReceiverWithoutDeclarationTest
 * @description Validates, as the contrast of the user member case, that without a class of the file declaring it the name is still rewritten to the core library member.
 */
export class VariableUserMemberUnknownReceiverWithoutDeclarationTest extends Test {
    /**
     * @type {string}
     */
    public readonly name: string = 'Variable User Member Unknown Receiver Without Declaration - Test';

    /**
     * @type {string}
     */
    public readonly description: string = "It has to rewrite a core library member name on a receiver of unknown type when the file does not declare it";
}
