import { Test } from "../../../Test";

/**
 * @class CommandUnicodeNameEnyeTest
 * @description Validates that a command named `añoNuevo` gets the slug `año-nuevo`.
 */
export class CommandUnicodeNameEnyeTest extends Test {
    /**
     * @type {string}
     */
    public readonly name: string = 'Command Unicode Name Enye - Test';

    /**
     * @type {string}
     */
    public readonly description: string = "It has to slugify a command name containing a ñ";
}
