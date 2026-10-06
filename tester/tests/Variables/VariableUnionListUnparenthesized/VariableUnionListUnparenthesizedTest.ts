import { Test } from "../../../Test";

/**
 * @class VariableUnionListUnparenthesizedTest
 * @description Validates that an array before a `|` without parentheses is rejected, suggesting to parenthesize it.
 */
export class VariableUnionListUnparenthesizedTest extends Test {
    /**
     * @type {string}
     */
    public readonly name: string = 'Variable Union List Unparenthesized - Test';

    /**
     * @type {string}
     */
    public readonly description: string = "It has to reject texto[]|numero and ask for parentheses";

    /**
     * @type {string}
     */
    public readonly expectedError: string = "Un tipo con '[]' dentro de una unión debe ir entre paréntesis: numero|(texto[])";
}
