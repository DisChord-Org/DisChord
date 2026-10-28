import { Test } from "../../../Test";

/**
 * @class CollectorButtonListTest
 * @description Validates that a key matching one of the ids of a list of buttons compiles.
 */
export class CollectorButtonListTest extends Test {
    /**
     * @type {string}
     */
    public readonly name: string = 'Collector Button List - Test';

    /**
     * @type {string}
     */
    public readonly description: string = "It has to accept a key of a list of buttons";
}
