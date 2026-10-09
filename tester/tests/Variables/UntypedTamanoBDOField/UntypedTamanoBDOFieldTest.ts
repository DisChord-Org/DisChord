import { Test } from "../../../Test";

/**
 * @class UntypedTamanoBDOFieldTest
 * @description Validates that `tamano` read on a receiver of unknown type gives the field of an object that has one.
 */
export class UntypedTamanoBDOFieldTest extends Test {
    /**
     * @type {string}
     */
    public readonly name: string = 'Untyped Tamano BDOField - Test';

    /**
     * @type {string}
     */
    public readonly description: string = "It has to read a bdo field named tamano through a receiver of unknown type";
}
