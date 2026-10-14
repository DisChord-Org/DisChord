import { Test } from "../../../Test";

/**
 * @class TupleIndexReadOutOfRangeTest
 * @description Validates that a literal index past the end of a tuple is rejected when read.
 */
export class TupleIndexReadOutOfRangeTest extends Test {
    /**
     * @type {string}
     */
    public readonly name: string = 'Tuple Index Read Out Of Range - Test';

    /**
     * @type {string}
     */
    public readonly description: string = "It has to reject reading a tuple past its end";

    /**
     * @type {string}
     */
    public readonly expectedError: string = "El índice 5 está fuera de rango: la tupla tiene 2 elemento(s) (índices del 0 al 1)";
}
