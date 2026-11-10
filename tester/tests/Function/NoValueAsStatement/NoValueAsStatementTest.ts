import { Test } from "../../../Test";

/**
 * @class NoValueAsStatementTest
 * @description Validates that a call that returns no value is accepted as a statement, as a chained Mapa.establecer and as the operand of devolver.
 */
export class NoValueAsStatementTest extends Test {
    /**
     * @type {string}
     */
    public readonly name: string = 'No Value As Statement - Test';

    /**
     * @type {string}
     */
    public readonly description: string = "It has to accept a call that returns no value only where it is a statement";

}
