import { Test } from "../../../Test";

/**
 * @class UntypedLongitudBDOFieldTest
 * @description Validates that `longitud` read on a receiver of unknown type gives the field of an object that has one, instead of an undefined `length`.
 */
export class UntypedLongitudBDOFieldTest extends Test {
    /**
     * @type {string}
     */
    public readonly name: string = 'Untyped Longitud BDOField - Test';

    /**
     * @type {string}
     */
    public readonly description: string = "It has to read a bdo field named longitud through a receiver of unknown type";
}
