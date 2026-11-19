import { Test } from "../../../Test";

/**
 * @class StartBotIntentsNotListTest
 * @description Validates that it has to reject the intents of the bot that are not a list.
 */
export class StartBotIntentsNotListTest extends Test {
    /**
     * @type {string}
     */
    public readonly name: string = 'Start Bot Intents Not List - Test';

    /**
     * @type {string}
     */
    public readonly description: string = "It has to reject the intents of the bot that are not a list";

    /**
     * @type {string}
     */
    public readonly expectedError: string = "'intenciones' debe ser una lista de intenciones";
}
