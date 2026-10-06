import { Test } from "../../../Test";

/**
 * @class VariableAwaitUnknownReceiverUniqueTest
 * @description Validates that a receiver of unknown type awaits when every class of the file declaring that method name marks it async.
 */
export class VariableAwaitUnknownReceiverUniqueTest extends Test {
    /**
     * @type {string}
     */
    public readonly name: string = 'Variable Await Unknown Receiver Unique - Test';

    /**
     * @type {string}
     */
    public readonly description: string = "It has to await a method called through an untyped receiver when it is async in every class declaring it";
}
