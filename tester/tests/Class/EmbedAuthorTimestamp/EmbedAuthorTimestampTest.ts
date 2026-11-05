import { Test } from "../../../Test";

/**
 * @class EmbedAuthorTimestampTest
 * @description Validates that an embed's `autor { nombre icono }` and `hora` compile to `.setAuthor({ text, iconUrl })` and `.setTimestamp()`.
 */
export class EmbedAuthorTimestampTest extends Test {
    /**
     * @type {string}
     */
    public readonly name: string = 'Embed Author Timestamp - Test';

    /**
     * @type {string}
     */
    public readonly description: string = "It has to generate the embed's author (with and without nombre and icono) and timestamp correctly";
}
