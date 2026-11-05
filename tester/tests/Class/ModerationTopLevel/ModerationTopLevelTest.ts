import { Test } from "../../../Test";

/**
 * @class ModerationTopLevelTest
 * @description It has to throw when a moderation action is used outside a command or an event
 */
export class ModerationTopLevelTest extends Test {
    /**
     * @type {string}
     */
    public readonly name: string = 'Moderation Top Level - Test';

    /**
     * @type {string}
     */
    public readonly description: string = "It has to throw when a moderation action is used outside a command or an event";

    /**
     * @type {string}
     */
    public readonly expectedError: string = "solo puede usarse dentro de un comando o un evento";
}
