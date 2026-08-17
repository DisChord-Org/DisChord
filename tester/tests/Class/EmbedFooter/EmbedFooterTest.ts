import { Test } from "../../../Test";

/**
 * @class EmbedFooterTest
 * @description Validates that an embed's `pie` (footer) property — `pie { texto "..."; icono "..."; }`
 * — compiles to the correct `.setFooter({ text, iconUrl })` call.
 */
export class EmbedFooterTest extends Test {
    /**
     * @type {string}
     */
    public readonly name: string = 'Embed Footer - Test';

    /**
     * @type {string}
     */
    public readonly description: string = "It has to generate the embed's footer (pie) with text and icon correctly";
}
