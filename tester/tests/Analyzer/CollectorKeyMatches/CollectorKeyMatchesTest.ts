import { Test } from "../../../Test";

/**
 * @class CollectorKeyMatchesTest
 * @description Validates that a key of alPulsarId that is the id of a button of its message compiles.
 */
export class CollectorKeyMatchesTest extends Test {
    /**
     * @type {string}
     */
    public readonly name: string = 'Collector Key Matches - Test';

    /**
     * @type {string}
     */
    public readonly description: string = "It has to accept a key that matches a button id";
}
