import { Test } from "../../../Test";

/**
 * @class VariableOwnTypeCongelarMismatchTest
 * @description Validates that `BDO.congelar` yields a `bdo`, rejecting an annotation that contradicts it.
 */
export class VariableOwnTypeCongelarMismatchTest extends Test {
    /**
     * @type {string}
     */
    public readonly name: string = 'Variable Own Type Congelar Mismatch - Test';

    /**
     * @type {string}
     */
    public readonly description: string = "It has to reject annotating the result of congelar with another type";

    /**
     * @type {string}
     */
    public readonly expectedError: string = "tipo 'texto' pero se le asignó un valor de tipo 'bdo'";
}
