import { Test } from "../../../Test";

/**
 * @class TupleIndexWriteOutOfRangeTest
 * @description Validates that a literal index past the end of a tuple is rejected when written.
 */
export class TupleIndexWriteOutOfRangeTest extends Test {
    /**
     * @type {string}
     */
    public readonly name: string = 'Tuple Index Write Out Of Range - Test';

    /**
     * @type {string}
     */
    public readonly description: string = "It has to reject writing a tuple past its end";

    /**
     * @type {string}
     */
    public readonly expectedError: string = "El índice 5 está fuera de rango: la tupla tiene 2 elemento(s) (índices del 0 al 1)";
}
