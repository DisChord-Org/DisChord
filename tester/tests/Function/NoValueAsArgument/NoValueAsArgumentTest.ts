import { Test } from "../../../Test";

/**
 * @class NoValueAsArgumentTest
 * @description Validates that a call that returns no value is rejected as an argument.
 */
export class NoValueAsArgumentTest extends Test {
    /**
     * @type {string}
     */
    public readonly name: string = 'No Value As Argument - Test';

    /**
     * @type {string}
     */
    public readonly description: string = "It has to reject a call that returns no value as an argument";

    /**
     * @type {string}
     */
    public readonly expectedError: string = "'g' no devuelve ningún valor, no se puede usar como argumento";
}
