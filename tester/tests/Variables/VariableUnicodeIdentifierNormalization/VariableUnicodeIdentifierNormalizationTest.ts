import { Test } from "../../../Test";

/**
 * @class VariableUnicodeIdentifierNormalizationTest
 * @description Validates that an identifier written with a composed letter and with the same letter decomposed (`n` + combining tilde) is the same identifier.
 */
export class VariableUnicodeIdentifierNormalizationTest extends Test {
    /**
     * @type {string}
     */
    public readonly name: string = 'Variable Unicode Identifier Normalization - Test';

    /**
     * @type {string}
     */
    public readonly description: string = "It has to treat composed and decomposed spellings of a letter as one identifier";
}
