import { Test } from "../../../Test";

/**
 * @class AwaitChainIndexAndLengthTest
 * @description Validates that an awaited call used as the receiver of an index access or of a property read is parenthesized.
 */
export class AwaitChainIndexAndLengthTest extends Test {
    /**
     * @type {string}
     */
    public readonly name: string = 'Await Chain Index And Length - Test';

    /**
     * @type {string}
     */
    public readonly description: string = "It has to parenthesize an awaited call used as the receiver of an index access";
}
