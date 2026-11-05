import { Test } from "../../../Test";

/**
 * @class ModerationBanInLoopTest
 * @description It has to throw when a moderation action is used inside a loop
 */
export class ModerationBanInLoopTest extends Test {
    /**
     * @type {string}
     */
    public readonly name: string = 'Moderation Ban In Loop - Test';

    /**
     * @type {string}
     */
    public readonly description: string = "It has to throw when a moderation action is used inside a loop";

    /**
     * @type {string}
     */
    public readonly expectedError: string = "no puede usarse dentro de un bucle";
}
