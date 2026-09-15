import { Test } from "../../../Test";

/**
 * @class VariableTupleLengthMismatchTest
 * @description Validates that `tipo [texto, numero]` rejects a list literal with a different
 * number of elements than the tuple declares, before even checking individual element types.
 */
export class VariableTupleLengthMismatchTest extends Test {
    /**
     * @type {string}
     */
    public readonly name: string = 'Variable Tuple Length Mismatch - Test';

    /**
     * @type {string}
     */
    public readonly description: string = "It has to reject a tuple-typed variable whose list literal has a different number of elements than the tuple declares";

    /**
     * @type {string}
     */
    public readonly expectedError: string = "se declaró como tupla de 2 elemento(s) pero se le asignó una lista de 1";
}
