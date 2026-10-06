import { Test } from "../../../Test";

/**
 * @class CommandUnicodeNameAsciiTest
 * @description Validates that the slug of an ASCII command name (`miComando`) is unchanged by the Unicode-aware boundary.
 */
export class CommandUnicodeNameAsciiTest extends Test {
    /**
     * @type {string}
     */
    public readonly name: string = 'Command Unicode Name Ascii - Test';

    /**
     * @type {string}
     */
    public readonly description: string = "It has to keep slugifying ASCII command names as before";
}
