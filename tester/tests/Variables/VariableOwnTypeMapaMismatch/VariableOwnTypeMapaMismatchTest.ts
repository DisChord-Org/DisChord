import { Test } from "../../../Test";

/**
 * @class VariableOwnTypeMapaMismatchTest
 * @description Validates that `Mapa.poner` yields a `Mapa`, rejecting an annotation that contradicts it.
 */
export class VariableOwnTypeMapaMismatchTest extends Test {
    /**
     * @type {string}
     */
    public readonly name: string = 'Variable Own Type Mapa Mismatch - Test';

    /**
     * @type {string}
     */
    public readonly description: string = "It has to reject annotating the result of poner with another type";

    /**
     * @type {string}
     */
    public readonly expectedError: string = "tipo 'texto' pero se le asignó un valor de tipo 'Mapa'";
}
