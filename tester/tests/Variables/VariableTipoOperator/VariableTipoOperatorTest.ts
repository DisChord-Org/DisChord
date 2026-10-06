import { Test } from "../../../Test";

/**
 * @class VariableTipoOperatorTest
 * @description Validates the code generated for the `tipo x` operator, which must report `lista` for a list, `bdo` for an object and `indefinido` for `null`, none of which native `typeof` tells apart.
 */
export class VariableTipoOperatorTest extends Test {
    /**
     * @type {string}
     */
    public readonly name: string = 'Variable Tipo Operator - Test';

    /**
     * @type {string}
     */
    public readonly description: string = "It has to compile the 'tipo' operator into an expression that tells lists, BDOs and null apart";
}
