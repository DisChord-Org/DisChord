import { Test } from "../../../Test";

/**
 * @class ImprimirAfterStatementTest
 * @description Validates that a statement whose callee starts with a parenthesis (`imprimir`) is
 * not read by JavaScript as a call on the statement before it: every top-level statement is closed.
 */
export class ImprimirAfterStatementTest extends Test {
    /**
     * @type {string}
     */
    public readonly name: string = 'Imprimir After Statement - Test';

    /**
     * @type {string}
     */
    public readonly description: string = 'It has to close the statement before a call that starts with a parenthesis';
}
