import { Test } from "../../../Test";

/**
 * @class AwaitChainPropertyTest
 * @description Validates that an awaited call used as the receiver of a member access is parenthesized, since `await` binds looser than `.`: the length of the resolved value is read, not the one of the promise.
 */
export class AwaitChainPropertyTest extends Test {
    /**
     * @type {string}
     */
    public readonly name: string = 'Await Chain Property - Test';

    /**
     * @type {string}
     */
    public readonly description: string = "It has to parenthesize an awaited call used as the receiver of a property read";
}
