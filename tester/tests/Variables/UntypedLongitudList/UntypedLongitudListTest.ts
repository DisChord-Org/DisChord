import { Test } from "../../../Test";

/**
 * @class UntypedLongitudListTest
 * @description Validates that `longitud` read on a receiver of unknown type gives the length of a list.
 */
export class UntypedLongitudListTest extends Test {
    /**
     * @type {string}
     */
    public readonly name: string = 'Untyped Longitud List - Test';

    /**
     * @type {string}
     */
    public readonly description: string = "It has to read the length of a list through a receiver of unknown type";
}
