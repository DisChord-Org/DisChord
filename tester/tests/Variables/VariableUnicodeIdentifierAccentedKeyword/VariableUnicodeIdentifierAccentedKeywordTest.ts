import { Test } from "../../../Test";

/**
 * @class VariableUnicodeIdentifierAccentedKeywordTest
 * @description Validates that a reserved word with an accent (`sí`) is a plain identifier, not the keyword `si`: it compiles as a call instead of a condition.
 */
export class VariableUnicodeIdentifierAccentedKeywordTest extends Test {
    /**
     * @type {string}
     */
    public readonly name: string = 'Variable Unicode Identifier Accented Keyword - Test';

    /**
     * @type {string}
     */
    public readonly description: string = "It has to not treat an accented reserved word as a keyword";
}
