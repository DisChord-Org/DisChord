import { Test } from "../../../Test";

/**
 * @class VariableAwaitListReceiverTest
 * @description Validates that a receiver of a known non-user type never consults the async methods of the file.
 */
export class VariableAwaitListReceiverTest extends Test {
    /**
     * @type {string}
     */
    public readonly name: string = 'Variable Await List Receiver - Test';

    /**
     * @type {string}
     */
    public readonly description: string = "It has to leave a call through a list without await even if a user class declares an async method of that name";
}
