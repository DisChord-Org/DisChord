import { Test } from "../../../Test";

/**
 * @class VariableOwnTypeConjuntoMismatchTest
 * @description Validates that `Conjunto.agregar` yields a `Conjunto`, rejecting an annotation that contradicts it.
 */
export class VariableOwnTypeConjuntoMismatchTest extends Test {
    /**
     * @type {string}
     */
    public readonly name: string = 'Variable Own Type Conjunto Mismatch - Test';

    /**
     * @type {string}
     */
    public readonly description: string = "It has to reject annotating the result of agregar with another type";

    /**
     * @type {string}
     */
    public readonly expectedError: string = "tipo 'numero' pero se le asignó un valor de tipo 'Conjunto'";
}
