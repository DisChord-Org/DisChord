import { Test } from "../../../Test";

/**
 * @class VariableTypeMismatchTest
 * @description Validates that declaring a variable with an explicit `tipo` annotation that
 * contradicts the literal value it's assigned (e.g. `tipo texto` bound to a number literal) is
 * rejected during analysis, rather than silently accepting the mismatched annotation.
 */
export class VariableTypeMismatchTest extends Test {
    /**
     * @type {string}
     */
    public readonly name: string = 'Variable Type Mismatch - Test';

    /**
     * @type {string}
     */
    public readonly description: string = "It has to reject a 'tipo' annotation that contradicts the literal value assigned to the variable";

    /**
     * @type {string}
     */
    public readonly expectedError: string = "se declaró con tipo 'texto' pero se le asignó un valor de tipo 'numero'";
}
