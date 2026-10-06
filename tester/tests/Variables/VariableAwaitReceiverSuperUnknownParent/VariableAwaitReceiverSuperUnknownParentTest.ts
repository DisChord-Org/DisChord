import { Test } from "../../../Test";

/**
 * @class VariableAwaitReceiverSuperUnknownParentTest
 * @description Pins today's behavior: a call through `super` is resolved only in the parent class, so when the parent is not a class of the file the call is not awaited, even if the class itself declares an async method of that name.
 */
export class VariableAwaitReceiverSuperUnknownParentTest extends Test {
    /**
     * @type {string}
     */
    public readonly name: string = 'Variable Await Receiver Super Unknown Parent - Test';

    /**
     * @type {string}
     */
    public readonly description: string = "It has to leave a super call without await when the parent class is not declared in the file";
}
