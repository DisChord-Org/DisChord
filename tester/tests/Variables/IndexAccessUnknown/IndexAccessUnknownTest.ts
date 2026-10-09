import { Test } from "../../../Test";

/**
 * @class IndexAccessUnknownTest
 * @description Validates that indexing a receiver of unknown type gives no type.
 */
export class IndexAccessUnknownTest extends Test {
    /**
     * @type {string}
     */
    public readonly name: string = 'Index Access Unknown - Test';

    /**
     * @type {string}
     */
    public readonly description: string = "It has to leave an element of an untyped receiver untyped";
}
