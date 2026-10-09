import { Test } from "../../../Test";

/**
 * @class ListInferClassIndexAwaitTest
 * @description Validates that an element of a list of instances is resolved by its class, so its async method is awaited even if another class declares a sync one of the same name.
 */
export class ListInferClassIndexAwaitTest extends Test {
    /**
     * @type {string}
     */
    public readonly name: string = 'ListInferClass Index Await - Test';

    /**
     * @type {string}
     */
    public readonly description: string = "It has to await a method of a list element by its class";
}
