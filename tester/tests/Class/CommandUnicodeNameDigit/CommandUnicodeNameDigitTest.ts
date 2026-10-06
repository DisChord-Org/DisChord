import { Test } from "../../../Test";

/**
 * @class CommandUnicodeNameDigitTest
 * @description Validates that a digit before a capital (`comando2Nuevo`) is not a camelCase boundary, so the slug stays `comando2nuevo`.
 * The historical slug is kept on purpose: hyphenating it would rename the command in already deployed bots.
 */
export class CommandUnicodeNameDigitTest extends Test {
    /**
     * @type {string}
     */
    public readonly name: string = 'Command Unicode Name Digit - Test';

    /**
     * @type {string}
     */
    public readonly description: string = "It has to keep the historical slug of a command name with a digit before a capital";
}
