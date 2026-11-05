import { Test } from "../../../Test";

/**
 * @class ModerationSelfTriggerKickTest
 * @description It has to throw on expulsar inside entradaMiembro
 */
export class ModerationSelfTriggerKickTest extends Test {
    /**
     * @type {string}
     */
    public readonly name: string = 'Moderation Self Trigger Kick - Test';

    /**
     * @type {string}
     */
    public readonly description: string = "It has to throw on expulsar inside entradaMiembro";

    /**
     * @type {string}
     */
    public readonly expectedError: string = "lo dispararía a sí mismo";
}
