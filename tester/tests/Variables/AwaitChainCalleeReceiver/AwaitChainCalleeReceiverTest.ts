import { Test } from "../../../Test";

/**
 * @class AwaitChainCalleeReceiverTest
 * @description Validates that a method called on the result of an awaited call is called on the resolved value.
 */
export class AwaitChainCalleeReceiverTest extends Test {
    /**
     * @type {string}
     */
    public readonly name: string = 'Await Chain Callee Receiver - Test';

    /**
     * @type {string}
     */
    public readonly description: string = "It has to parenthesize an awaited call used as the receiver of a method call";
}
