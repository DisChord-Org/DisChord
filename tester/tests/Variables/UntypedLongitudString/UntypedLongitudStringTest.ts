import { Test } from "../../../Test";

/**
 * @class UntypedLongitudStringTest
 * @description Validates that `longitud` read on a receiver of unknown type goes through the runtime helper, which gives the length of a text.
 */
export class UntypedLongitudStringTest extends Test {
    /**
     * @type {string}
     */
    public readonly name: string = 'Untyped Longitud String - Test';

    /**
     * @type {string}
     */
    public readonly description: string = "It has to read the length of a text through a receiver of unknown type";
}
