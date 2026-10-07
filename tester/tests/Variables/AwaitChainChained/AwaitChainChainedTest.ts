import { Test } from "../../../Test";

/**
 * @class AwaitChainChainedTest
 * @description Validates that chained calls that are both awaited nest their parentheses, awaiting each result before using it.
 */
export class AwaitChainChainedTest extends Test {
    /**
     * @type {string}
     */
    public readonly name: string = 'Await Chain Chained - Test';

    /**
     * @type {string}
     */
    public readonly description: string = "It has to parenthesize each awaited call of a chain";
}
