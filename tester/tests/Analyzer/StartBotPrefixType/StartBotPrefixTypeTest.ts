import { Test } from "../../../Test";

/**
 * @class StartBotPrefixTypeTest
 * @description Validates that it has to reject a number as the prefix of the bot.
 */
export class StartBotPrefixTypeTest extends Test {
    /**
     * @type {string}
     */
    public readonly name: string = 'Start Bot Prefix Type - Test';

    /**
     * @type {string}
     */
    public readonly description: string = "It has to reject a number as the prefix of the bot";

    /**
     * @type {string}
     */
    public readonly expectedError: string = "'encender bot' espera un valor de tipo 'texto|(texto[])' en 'prefijo', se recibió 'numero'";
}
