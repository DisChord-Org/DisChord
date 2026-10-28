import { Test } from "../../../Test";

/**
 * @class NamesUndeclaredCalleeTest
 * @description Validates that calling a function that is declared nowhere is rejected.
 */
export class NamesUndeclaredCalleeTest extends Test {
    /**
     * @type {string}
     */
    public readonly name: string = 'Names Undeclared Callee - Test';

    /**
     * @type {string}
     */
    public readonly description: string = "It has to reject an undeclared name used as the callee of a call";

    /**
     * @type {string}
     */
    public readonly expectedError: string = "El nombre 'nadie' no está declarado.";
}
