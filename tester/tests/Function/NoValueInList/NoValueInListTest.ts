import { Test } from "../../../Test";

/**
 * @class NoValueInListTest
 * @description Validates that a call that returns no value is rejected as an element of a list.
 */
export class NoValueInListTest extends Test {
    /**
     * @type {string}
     */
    public readonly name: string = 'No Value In List - Test';

    /**
     * @type {string}
     */
    public readonly description: string = "It has to reject a call that returns no value as an element of a list";

    /**
     * @type {string}
     */
    public readonly expectedError: string = "'g' no devuelve ningún valor, no se puede usar como elemento de lista";
}
