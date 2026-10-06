import { Test } from "../../../Test";

/**
 * @class VariableUnicodeIdentifierSymbolTest
 * @description Validates that a character that is not a letter is still rejected by the lexer.
 */
export class VariableUnicodeIdentifierSymbolTest extends Test {
    /**
     * @type {string}
     */
    public readonly name: string = 'Variable Unicode Identifier Symbol - Test';

    /**
     * @type {string}
     */
    public readonly description: string = "It has to reject a symbol that is not a letter";

    /**
     * @type {string}
     */
    public readonly expectedError: string = "Carácter inesperado";
}
