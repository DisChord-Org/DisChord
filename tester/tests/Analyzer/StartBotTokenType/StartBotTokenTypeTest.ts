import { Test } from "../../../Test";

/**
 * @class StartBotTokenTypeTest
 * @description Validates that it has to reject a number as the token of the bot.
 */
export class StartBotTokenTypeTest extends Test {
    /**
     * @type {string}
     */
    public readonly name: string = 'Start Bot Token Type - Test';

    /**
     * @type {string}
     */
    public readonly description: string = "It has to reject a number as the token of the bot";

    /**
     * @type {string}
     */
    public readonly expectedError: string = "'encender bot' espera un valor de tipo 'texto' en 'token', se recibió 'numero'";
}
