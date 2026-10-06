import { Test } from "../../../Test";

/**
 * @class VariableOwnTypeChainedMismatchTest
 * @description Validates that a call chained after `Mapa.poner` is typed by the member of `Mapa` it names (`tiene` yields `booleano`).
 */
export class VariableOwnTypeChainedMismatchTest extends Test {
    /**
     * @type {string}
     */
    public readonly name: string = 'Variable Own Type Chained Mismatch - Test';

    /**
     * @type {string}
     */
    public readonly description: string = "It has to reject annotating a chained call with a type contradicting its member";

    /**
     * @type {string}
     */
    public readonly expectedError: string = "tipo 'texto' pero se le asignó un valor de tipo 'booleano'";
}
