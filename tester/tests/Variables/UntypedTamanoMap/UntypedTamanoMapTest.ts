import { Test } from "../../../Test";

/**
 * @class UntypedTamanoMapTest
 * @description Validates that `tamano` read on a receiver of unknown type gives the size of a map.
 */
export class UntypedTamanoMapTest extends Test {
    /**
     * @type {string}
     */
    public readonly name: string = 'Untyped Tamano Map - Test';

    /**
     * @type {string}
     */
    public readonly description: string = "It has to read the size of a map through a receiver of unknown type";
}
