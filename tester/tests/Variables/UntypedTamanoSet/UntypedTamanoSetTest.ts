import { Test } from "../../../Test";

/**
 * @class UntypedTamanoSetTest
 * @description Validates that `tamano` read on a receiver of unknown type gives the size of a set.
 */
export class UntypedTamanoSetTest extends Test {
    /**
     * @type {string}
     */
    public readonly name: string = 'Untyped Tamano Set - Test';

    /**
     * @type {string}
     */
    public readonly description: string = "It has to read the size of a set through a receiver of unknown type";
}
