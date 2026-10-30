import { Test } from "../../../Test";

/**
 * @class TypedUserArgumentMismatchTest
 * @description It has to reject a number passed where a function expects a user
 */
export class TypedUserArgumentMismatchTest extends Test {
    /**
     * @type {string}
     */
    public readonly name: string = 'Typed User Argument Mismatch - Test';

    /**
     * @type {string}
     */
    public readonly description: string = "It has to reject a number passed where a function expects a user";

    /**
     * @type {string}
     */
    public readonly expectedError: string = "El argumento 1 de 'saluda' es de tipo 'numero', se esperaba 'Usuario'";
}
