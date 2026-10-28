import { Test } from "../../../Test";

/**
 * @class NamesUndeclaredInExpressionTest
 * @description Validates that a name used in an expression and declared nowhere is rejected when compiling, not when running.
 */
export class NamesUndeclaredInExpressionTest extends Test {
    /**
     * @type {string}
     */
    public readonly name: string = 'Names Undeclared In Expression - Test';

    /**
     * @type {string}
     */
    public readonly description: string = "It has to reject an undeclared name read in an expression";

    /**
     * @type {string}
     */
    public readonly expectedError: string = "El nombre 'nadie' no está declarado.";
}
