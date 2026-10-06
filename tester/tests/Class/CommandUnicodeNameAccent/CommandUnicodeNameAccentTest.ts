import { Test } from "../../../Test";

/**
 * @class CommandUnicodeNameAccentTest
 * @description Validates that a command named `canciónPopular` gets the slug `canción-popular`.
 */
export class CommandUnicodeNameAccentTest extends Test {
    /**
     * @type {string}
     */
    public readonly name: string = 'Command Unicode Name Accent - Test';

    /**
     * @type {string}
     */
    public readonly description: string = "It has to slugify an accented command name at the camelCase boundary";
}
