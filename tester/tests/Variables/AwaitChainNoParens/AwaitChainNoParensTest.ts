import { Test } from "../../../Test";

/**
 * @class AwaitChainNoParensTest
 * @description Validates that an awaited call needs no parentheses as an argument, in a binary operation, in a condition or in a return.
 */
export class AwaitChainNoParensTest extends Test {
    /**
     * @type {string}
     */
    public readonly name: string = 'Await Chain No Parens - Test';

    /**
     * @type {string}
     */
    public readonly description: string = "It has to leave an awaited call without parentheses where no member is read from it";
}
