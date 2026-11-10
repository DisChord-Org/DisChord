import { Test } from "../../../Test";

/**
 * @class UnexpectedTokenInValueTest
 * @description It has to describe the unexpected token in plain words, without a token name or a cursor index
 */
export class UnexpectedTokenInValueTest extends Test {
    /**
     * @type {string}
     */
    public readonly name: string = 'Unexpected Token In Value - Test';

    /**
     * @type {string}
     */
    public readonly description: string = "It has to describe the unexpected token in plain words, without a token name or a cursor index";

    /**
     * @type {string}
     */
    public readonly expectedError: string = "Token inesperado: se esperaba un valor (un número, un texto, un nombre...) y se encontró ':'";
}
