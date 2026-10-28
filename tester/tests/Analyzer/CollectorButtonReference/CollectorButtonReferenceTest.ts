import { Test } from "../../../Test";

/**
 * @class CollectorButtonReferenceTest
 * @description Validates that a key matching the id of a button declared on its own and used by name compiles.
 */
export class CollectorButtonReferenceTest extends Test {
    /**
     * @type {string}
     */
    public readonly name: string = 'Collector Button Reference - Test';

    /**
     * @type {string}
     */
    public readonly description: string = "It has to resolve a button reference";
}
